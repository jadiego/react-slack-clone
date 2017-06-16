package handlers

import (
	"github.com/jadiego/howl/apiserver/models/messages"
	"github.com/jadiego/howl/apiserver/models/users"
	"github.com/jadiego/howl/apiserver/sessions"
	"github.com/jadiego/howl/apiserver/websocket"
)

//Context is a way for the main function to provide
//dependencies to the handlers as it adds them to the mux.
//it holds all the shared values that multiple HTTP Handlers will need
type Context struct {
	//a string that will contain the session ID signing key
	SessionKey string
	//a sessions.Store that will contain the server's session store
	SessionStore sessions.Store
	//an users.Store that will contain the server's user store
	UserStore users.Store
	//an messages.Store that will contain the server's message store
	MessageStore messages.Store
	//a pointer to Notifier fo websockets
	Notifier *notifier.Notifier
}
