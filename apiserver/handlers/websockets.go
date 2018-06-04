package handlers

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/jadiego/react-slack-clone/apiserver/sessions"
)

//WebSocketUpgradeHandler handles websocket upgrade requests
func (ctx *Context) WebSocketUpgradeHandler(w http.ResponseWriter, r *http.Request) {
	//Ensures the user is authenticated first
	ss := &SessionState{}
	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		http.Error(w, "error getting current session: "+err.Error(), http.StatusUnauthorized)
		return
	}

	//upgrade this request to a web socket connection
	//see https://godoc.org/github.com/gorilla/websocket#hdr-Overview
	//NOTE that by default, the websocket package will reject
	//cross-origin upgrade requests, so make sure you set the
	//CheckOrigin field of the Upgrader to allow upgrades from
	//any origin.
	//See https://godoc.org/github.com/gorilla/websocket#hdr-Origin_Considerations
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "error upgrading connection:"+err.Error(), http.StatusInternalServerError)
		return
	}

	//after upgrading, use the `.AddClient()` method on your notifier
	//to add the new client to your notifier's map of clients
	ctx.Notifier.AddClient(conn)
}
