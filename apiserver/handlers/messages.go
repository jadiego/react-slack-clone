package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jadiego/howl/apiserver/models/messages"
	"github.com/jadiego/howl/apiserver/models/users"
	"github.com/jadiego/howl/apiserver/sessions"

	"path"
)

//ChannelsHandler handles all requests to the /v1/channels path.
//A GET request returns a slice of channels the current user is authorized to see.
//A POST request adds the current user to the channel's member list and
//inserts the channel to the store, and then responds with the new Channel
func (ctx *Context) ChannelsHandler(w http.ResponseWriter, r *http.Request) {
	//get the current user to get context for which update this belongs to
	ss := &SessionState{}
	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		http.Error(w, "error getting current session : "+err.Error(), http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case "POST":
		//Decode the request body into a models.NewChannel struct
		d := json.NewDecoder(r.Body)
		nc := &messages.NewChannel{}
		if err := d.Decode(nc); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		//Validate the models.NewChannel
		err := nc.Validate()
		if err != nil {
			http.Error(w, "invalid channel: "+err.Error(), http.StatusBadRequest)
			return
		}

		//adds creator to members list if empty
		if len(nc.Members) == 0 {
			nc.Members = append(nc.Members, ss.User.ID)
		}

		c, err := ctx.MessageStore.InsertChannel(ss.User.ID, nc)
		if err != nil {
			http.Error(w, "error inserting channel: "+err.Error(), http.StatusInternalServerError)
			return
		}

		//Notify client of new channel through websocket
		n, err := c.ToNewChannelEvent()
		if err != nil {
			http.Error(w, "error creating channel event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(c)

	case "GET":
		//returns a slice of channels the current user is authorized to see.
		cs, err := ctx.MessageStore.GetMyChannels(ss.User.ID)
		if err != nil {
			http.Error(w, "error getting channels: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(cs)
	}
}

//SpecificChannelHandler handles all requests to the /v1/channels/<channel-id> path.
//A GET request gets the most recent 500 messages form the specified channel if user
//is allowed.
//A PATCH request updates the channel's name/description if the current user is creator
//A DELETE request deletes the specified channel if current user is creator
//A LINK request adds the current user to the members list of the specified channel if
//it's public. Uses the 'Link' header to get the userID to allow channel creators to add
//users to private channels.
//A UNLINK request removes the current user to the members list. Uses 'Link' header to
//get the userID to allow channel creators to remove users from private channel.
func (ctx *Context) SpecificChannelHandler(w http.ResponseWriter, r *http.Request) {
	//Get the channelID from the request's URL path
	_, id := path.Split(r.URL.String())

	//Get current state
	ss := &SessionState{}
	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		http.Error(w, "error getting current session : "+err.Error(), http.StatusUnauthorized)
		return
	}

	//Get channel from store
	c, err := ctx.MessageStore.GetChannelByID(messages.ChannelID(id))
	if err != nil {
		http.Error(w, "error getting channel: "+err.Error(), http.StatusNotFound)
		return
	}

	switch r.Method {
	//gets the most recent 500 messages form the specified channel if user is allowed.
	case "GET":
		if c.Private && !c.IsMember(ss.User.ID) {
			http.Error(w, "error getting channel : you are either not a member or the channel is private", http.StatusUnauthorized)
			return
		}

		ms, err := ctx.MessageStore.GetChannelMessages(messages.ChannelID(id), 500)
		if err != nil {
			http.Error(w, "error getting channel messages: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(ms)
	//updates the channel's name/description if the current user is creator
	case "PATCH":
		if ss.User.ID != c.CreatorID {
			http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
			return
		}

		d := json.NewDecoder(r.Body)
		cu := &messages.ChannelUpdates{}
		if err := d.Decode(cu); err != nil {
			http.Error(w, "error decoding JSON"+err.Error(), http.StatusBadRequest)
			return
		}

		if err := cu.Validate(); err != nil {
			http.Error(w, "invalid channel: "+err.Error(), http.StatusBadRequest)
			return
		}

		uc, err := ctx.MessageStore.UpdateChannel(cu, c)
		if err != nil {
			http.Error(w, "error updating channel: "+err.Error(), http.StatusInternalServerError)
			return
		}

		//Notify client of updated channel through websocket
		n, err := uc.ToUpdatedChannelEvent()
		if err != nil {
			http.Error(w, "error creating channel event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(uc)

	//deletes the specified channel if current user is creator
	case "DELETE":
		if ss.User.ID != c.CreatorID {
			http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
			return
		}

		if err := ctx.MessageStore.DeleteChannel(messages.ChannelID(id)); err != nil {
			http.Error(w, "error deleting channel: "+err.Error(), http.StatusInternalServerError)
			return
		}

		//Notify client of deleted channel through websocket
		n, err := c.ToDeletedChannelEvent()
		if err != nil {
			http.Error(w, "error creating channel event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeText)
		w.Write([]byte("channel succesfully deleted"))

	//adds the current user to the members list of the specified channel if
	//it's public. Uses the 'Link' header to get the userID to allow channel creators to add
	//users to private channels.
	case "LINK":
		w.Header().Add(headerContentType, contentTypeText)
		if c.Private {
			if ss.User.ID != c.CreatorID {
				http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
				return
			}
			//grab id from Link header
			id := users.UserID(r.Header.Get(headerLink))
			//if it's zero length, return StatusbadRequest
			if len(id) == 0 {
				http.Error(w, "invalid id used in Link header", http.StatusBadRequest)
				return
			}

			if err := ctx.MessageStore.AddChannelMember(id, c); err != nil {
				http.Error(w, "error adding member to channel: "+err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("succesfully added member to channel"))
		} else {
			if err := ctx.MessageStore.AddChannelMember(ss.User.ID, c); err != nil {
				http.Error(w, "error adding current user to channel: "+err.Error(), http.StatusInternalServerError)
				return
			}

			//Notify client of new user joined channel through websocket
			n, err := ss.User.ToUserJoinedChannelEvent()
			if err != nil {
				http.Error(w, "error creating user event: "+err.Error(), http.StatusInternalServerError)
				return
			}
			ctx.Notifier.Notify(n)

			w.Write([]byte("succesfully added member to channel"))
		}
	//removes the current user to the members list. Uses 'Link' header to
	//get the userID to allow channel creators to remove users from private channel.
	case "UNLINK":
		w.Header().Add(headerContentType, contentTypeText)
		if c.Private {
			if ss.User.ID != c.CreatorID {
				http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
				return
			}
			//grab id from Link header
			id := users.UserID(r.Header.Get(headerLink))
			//if it's zero length, return StatusbadRequest
			if len(id) == 0 {
				http.Error(w, "invalid id used in Link header", http.StatusBadRequest)
				return
			}

			if err := ctx.MessageStore.RemoveChannelmember(id, c); err != nil {
				http.Error(w, "error removing member from channel: "+err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("succesfully removed member from channel"))
		} else {
			if err := ctx.MessageStore.RemoveChannelmember(ss.User.ID, c); err != nil {
				http.Error(w, "error removing member from channel: "+err.Error(), http.StatusInternalServerError)
				return
			}

			//Notify client of user left channel through websocket
			n, err := ss.User.ToUserLeftChannelEvent()
			if err != nil {
				http.Error(w, "error creating user event: "+err.Error(), http.StatusInternalServerError)
				return
			}
			ctx.Notifier.Notify(n)

			w.Write([]byte("succesfully removed member from channel"))
		}
	}
}

//MessageHandler handles all requests to the /v1/messages path.
//A POST request inserts the new message
func (ctx *Context) MessageHandler(w http.ResponseWriter, r *http.Request) {
	//get the current user
	ss := &SessionState{}
	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		http.Error(w, "error getting current session : "+err.Error(), http.StatusUnauthorized)
		return
	}

	if r.Method == "POST" {

		d := json.NewDecoder(r.Body)
		nm := &messages.NewMessage{}
		if err := d.Decode(nm); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
		}

		//Validate the models.NewMessage
		err := nm.Validate()
		if err != nil {
			http.Error(w, "invalid message: "+err.Error(), http.StatusBadRequest)
			return
		}

		m, err := ctx.MessageStore.InsertMessage(ss.User.ID, nm)
		if err != nil {
			http.Error(w, "error inserting message: "+err.Error(), http.StatusBadRequest)
			return
		}

		//Notify client of new message through websocket
		n, err := m.ToNewMessageEvent()
		if err != nil {
			http.Error(w, "error creating message event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(m)

	}
}

//SpecificMessageHandler handlers all requests made to the /v1/messages/<message-id> path.
//A PATCH request updates the specified message if the current user is the is owner.
//writes back the updated message
//A DELETE request deletes the message if the current user is the owner.
func (ctx *Context) SpecificMessageHandler(w http.ResponseWriter, r *http.Request) {
	//get the messageID form the request's URL path
	_, id := path.Split(r.URL.String())

	//Get current state
	ss := &SessionState{}
	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		http.Error(w, "error getting current session : "+err.Error(), http.StatusUnauthorized)
		return
	}

	//Get message from store
	m, err := ctx.MessageStore.GetMessageByID(messages.MessageID(id))
	if err != nil {
		http.Error(w, "error getting message: "+err.Error(), http.StatusNotFound)
		return
	}

	//if the user is not owner throw error
	if ss.User.ID != m.CreatorID {
		http.Error(w, "error updating message: you aren't the owner", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	//updates the specified message if the current user is the is owner.
	//writes back the updated message
	case "PATCH":
		d := json.NewDecoder(r.Body)
		mu := &messages.MessageUpdates{}
		if err := d.Decode(mu); err != nil {
			http.Error(w, "error decoding JSON"+err.Error(), http.StatusBadRequest)
			return
		}

		um, err := ctx.MessageStore.UpdateMessage(mu, m)
		if err != nil {
			http.Error(w, "error updating message: "+err.Error(), http.StatusInternalServerError)
			return
		}

		//Notify client of updated message through websocket
		n, err := um.ToUpdatedMessageEvent()
		if err != nil {
			http.Error(w, "error creating message event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(um)
	//deletes the message if the current user is the owner.
	case "DELETE":
		if err := ctx.MessageStore.DeleteMessage(messages.MessageID(id)); err != nil {
			http.Error(w, "error deleting message: "+err.Error(), http.StatusInternalServerError)
			return
		}

		//Notify client of updated message through websocket
		n, err := m.ToDeletedMessageEvent()
		if err != nil {
			http.Error(w, "error creating message event: "+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.Notifier.Notify(n)

		w.Header().Add(headerContentType, contentTypeText)
		w.Write([]byte("message succesfully deleted"))
	}
}
