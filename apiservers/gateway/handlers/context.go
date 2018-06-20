package handlers

import (
	"github.com/jadiego/react-slack-clone/apiservers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/apiservers/gateway/sessions"
)

// Context is a way for the main function to provide
// dependencies to the handlers as it adds them to the mux.
// it holds all the shared values that multiple HTTP Handlers will need
type Context struct {
	// a string that will contain the session ID signing key
	SessionKey string
	// a sessions.Store that will contain the server's session store
	SessionStore sessions.Store
	// an users.Store that will contain the server's user store
	UserStore users.Store
}

// NewHandlerContext constructs a new Context,
// ensuring that the dependencies are valid values.
func NewHandlerContext(signingKey string, sessionStore sessions.Store, userStore users.Store) *Context {

	if len(signingKey) == 0 {
		panic("signing key has length of zero")
	}

	if sessionStore == nil {
		panic("nil session store")
	}

	if userStore == nil {
		panic("nil user store")
	}

	return &Context{signingKey, sessionStore, userStore}
}
