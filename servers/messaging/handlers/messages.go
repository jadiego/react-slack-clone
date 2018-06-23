package handlers

import (
	"encoding/json"
	"net/http"
	"path"

	"github.com/jadiego/react-slack-clone/servers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/servers/messaging/models/messages"
)

// MessageHandler handles all requests to the /v1/messages path.
// A POST request inserts the new message
func (ctx *Context) MessageHandler(w http.ResponseWriter, r *http.Request) {
	// get the current user to get context for which update this belongs to
	userjson := r.Header.Get(headerXUser)
	var user users.User
	err := json.Unmarshal([]byte(userjson), &user)
	if err != nil {
		http.Error(w, "error getting current session : "+ErrInvalidUserHeader.Error(),
			http.StatusUnauthorized)
		return
	}

	if r.Method == "POST" {

		d := json.NewDecoder(r.Body)
		nm := &messages.NewMessage{}
		if err := d.Decode(nm); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
		}

		// Validate the models.NewMessage
		err := nm.Validate()
		if err != nil {
			http.Error(w, "invalid message: "+err.Error(), http.StatusBadRequest)
			return
		}

		m, err := ctx.MessageStore.InsertMessage(user.ID, nm)
		if err != nil {
			http.Error(w, "error posting message: "+err.Error(), http.StatusBadRequest)
			return
		}

		msgevent, err := m.ToMessageEvent("new")
		if err != nil {
			http.Error(w, "error creating websocket message event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(msgevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(m)

	}
}

// SpecificMessageHandler handlers all requests made to the /v1/messages/<message-id> path.
// A PATCH request updates the specified message if the current user is the is owner.
// writes back the updated message
// A DELETE request deletes the message if the current user is the owner.
func (ctx *Context) SpecificMessageHandler(w http.ResponseWriter, r *http.Request) {
	//get the messageID form the request's URL path
	_, id := path.Split(r.URL.String())

	//get the current user to get context for which update this belongs to
	userjson := r.Header.Get(headerXUser)
	var user users.User
	err := json.Unmarshal([]byte(userjson), &user)
	if err != nil {
		http.Error(w, "error getting current session : "+ErrInvalidUserHeader.Error(),
			http.StatusUnauthorized)
		return
	}

	//Get message from store
	m, err := ctx.MessageStore.GetMessageByID(messages.MessageID(id))
	if err != nil {
		http.Error(w, "error getting message: "+err.Error(), http.StatusNotFound)
		return
	}

	//if the user is not owner throw error
	if user.ID != m.CreatorID {
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

		msgevent, err := um.ToMessageEvent("update")
		if err != nil {
			http.Error(w, "error creating websocket message event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(msgevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(um)
	//deletes the message if the current user is the owner.
	case "DELETE":
		if err := ctx.MessageStore.DeleteMessage(messages.MessageID(id)); err != nil {
			http.Error(w, "error deleting message: "+err.Error(), http.StatusInternalServerError)
			return
		}

		msgevent, err := m.ToMessageEvent("delete")
		if err != nil {
			http.Error(w, "error creating websocket message event", http.StatusInternalServerError)
			return
		}
		err = ctx.MessagingMQ.PublishToMessagingMQ(msgevent)
		if err != nil {
			http.Error(w, "error notifying websocket clients: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeTextUTF8)
		w.Write([]byte("message succesfully deleted"))
	}
}
