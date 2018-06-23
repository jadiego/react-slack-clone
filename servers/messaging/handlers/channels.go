package handlers

import (
	"encoding/json"
	"net/http"
	"path"

	"github.com/jadiego/react-slack-clone/servers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/servers/messaging/models/messages"
)

// ChannelsHandler handles all requests to the /v1/channels path.
// A GET request returns a slice of channels the current user is authorized to see.
// A POST request adds the current user to the channel's member list and
// inserts the channel to the store, and then responds with the new Channel
func (ctx *Context) ChannelsHandler(w http.ResponseWriter, r *http.Request) {
	// get the current user to get context for which update this belongs to
	userjson := r.Header.Get(headerXUser)
	var user users.User
	err := json.Unmarshal([]byte(userjson), &user)
	if err != nil {
		http.Error(w, "error getting current session : "+ErrInvalidUserHeader.Error(),
			http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case "POST":
		// Decode the request body into a models.NewChannel struct
		d := json.NewDecoder(r.Body)
		nc := &messages.NewChannel{}
		if err := d.Decode(nc); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		// Validate the models.NewChannel
		err := nc.Validate()
		if err != nil {
			http.Error(w, "invalid channel: "+err.Error(), http.StatusBadRequest)
			return
		}

		// adds creator to members list if empty
		if len(nc.Members) == 0 {
			nc.Members = append(nc.Members, user.ID)
		}

		c, err := ctx.MessageStore.InsertChannel(user.ID, nc)
		if err != nil {
			http.Error(w, "error inserting channel: "+err.Error(), http.StatusInternalServerError)
			return
		}

		chevent, err := c.ToChannelEvent("new")
		if err != nil {
			http.Error(w, "error creating websocket channel event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(chevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(c)

	case "GET":

		// returns a slice of channels the current user is authorized to see.
		cs, err := ctx.MessageStore.GetMyChannels(user.ID)
		if err != nil {
			http.Error(w, "error getting channels: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(cs)
	}
}

// SpecificChannelHandler handles all requests to the /v1/channels/<channel-id> path.
// A GET request gets the most recent 500 messages form the specified channel if user
// is allowed.
// A PATCH request updates the channel's name/description if the current user is creator
// A DELETE request deletes the specified channel if current user is creator
// A LINK request adds the current user to the members list of the specified channel if
// it's public. Uses the 'Link' header to get the userID to allow channel creators to add
// users to private channels.
// A UNLINK request removes the current user to the members list. Uses 'Link' header to
// get the userID to allow channel creators to remove users from private channel.
func (ctx *Context) SpecificChannelHandler(w http.ResponseWriter, r *http.Request) {
	// Get the channelID from the request's URL path
	_, id := path.Split(r.URL.String())

	// get the current user to get context for which update this belongs to
	userjson := r.Header.Get(headerXUser)
	var user users.User
	err := json.Unmarshal([]byte(userjson), &user)
	if err != nil {
		http.Error(w, "error getting current session : "+ErrInvalidUserHeader.Error(),
			http.StatusUnauthorized)
		return
	}

	// Get channel from store
	c, err := ctx.MessageStore.GetChannelByID(messages.ChannelID(id))
	if err != nil {
		http.Error(w, "error getting channel: "+err.Error(), http.StatusNotFound)
		return
	}

	switch r.Method {
	// gets the most recent 500 messages form the specified channel if user is allowed.
	case "GET":
		if c.Private && !c.IsMember(user.ID) {
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
	// updates the channel's name/description if the current user is creator
	case "PATCH":
		if user.ID != c.CreatorID {
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

		chevent, err := uc.ToChannelEvent("update")
		if err != nil {
			http.Error(w, "error creating websocket channel event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(chevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(uc)

	// deletes the specified channel if current user is creator
	case "DELETE":
		if user.ID != c.CreatorID {
			http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
			return
		}

		if err := ctx.MessageStore.DeleteChannel(messages.ChannelID(id)); err != nil {
			http.Error(w, "error deleting channel: "+err.Error(), http.StatusInternalServerError)
			return
		}

		chevent, err := c.ToChannelEvent("delete")
		if err != nil {
			http.Error(w, "error creating websocket channel event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(chevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeTextUTF8)
		w.Write([]byte("channel succesfully deleted"))

	// adds the current user to the members list of the specified channel if
	// it's public. Uses the 'Link' header to get the userID to allow channel creators to add
	// users to private channels.
	case "LINK":
		w.Header().Add(headerContentType, contentTypeTextUTF8)
		if c.Private {
			if user.ID != c.CreatorID {
				http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
				return
			}
			// grab id from Link header
			id := users.UserID(r.Header.Get(headerLink))
			// if it's zero length, return StatusbadRequest
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
			if err := ctx.MessageStore.AddChannelMember(user.ID, c); err != nil {
				http.Error(w, "error adding current user to channel: "+err.Error(), http.StatusInternalServerError)
				return
			}

			w.Write([]byte("succesfully added member to channel"))
		}
	// removes the current user to the members list. Uses 'Link' header to
	// get the userID to allow channel creators to remove users from private channel.
	case "UNLINK":
		w.Header().Add(headerContentType, contentTypeTextUTF8)
		if c.Private {
			if user.ID != c.CreatorID {
				http.Error(w, "error updating channel: you aren't the owner", http.StatusUnauthorized)
				return
			}
			// grab id from Link header
			id := users.UserID(r.Header.Get(headerLink))
			// if it's zero length, return StatusbadRequest
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
			if err := ctx.MessageStore.RemoveChannelmember(user.ID, c); err != nil {
				http.Error(w, "error removing member from channel: "+err.Error(), http.StatusInternalServerError)
				return
			}

			w.Write([]byte("succesfully removed member from channel"))
		}
	}
}
