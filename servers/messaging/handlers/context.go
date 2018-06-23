package handlers

import (
	"github.com/jadiego/react-slack-clone/servers/messaging/models/messages"
	"github.com/jadiego/react-slack-clone/servers/messaging/mq"
)

// Context is a way for the main function to provide
// dependencies to the handlers as it adds them to the mux.
// it holds all the shared values that multiple HTTP Handlers will need
type Context struct {
	// an messages.Store that will contain the server's message store
	MessageStore messages.Store
	MessagingMQ  mq.MessagingMQ
}

// NewHandlerContext constructs a new Context,
// ensuring that the dependencies are valid values.
func NewHandlerContext(messageStore messages.Store, messagingQueue mq.MessagingMQ) *Context {
	if messageStore == nil {
		panic("nil messages store")
	}

	if messageStore == nil {
		panic("nil messaging RabbitMQ")
	}

	return &Context{messageStore, messagingQueue}
}
