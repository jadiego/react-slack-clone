package handlers

import (
	"github.com/jadiego/react-slack-clone/apiservers/messaging/models/messages"
)

// Context is a way for the main function to provide
// dependencies to the handlers as it adds them to the mux.
// it holds all the shared values that multiple HTTP Handlers will need
type Context struct {
	// an messages.Store that will contain the server's message store
	MessageStore messages.Store
}

// NewHandlerContext constructs a new Context,
// ensuring that the dependencies are valid values.
func NewHandlerContext(messageStore messages.Store) *Context {
	if messageStore == nil {
		panic("nil messages store")
	}

	return &Context{messageStore}
}
