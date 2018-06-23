package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httputil"
	"strings"
	"sync"

	"github.com/jadiego/react-slack-clone/servers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/servers/gateway/sessions"
)

const defaultURLScheme = "http"

// NewServiceProxy returns a new ReverProxy for a microservice
// given a comma-delimited list of network addresses
func NewServiceProxy(addrs string, ctx *Context) *httputil.ReverseProxy {
	splitAddrs := strings.Split(addrs, ",")
	nextAddr := 0
	mx := sync.Mutex{}

	return &httputil.ReverseProxy{
		Director: func(r *http.Request) {
			r.URL.Scheme = defaultURLScheme
			mx.Lock()
			r.URL.Host = splitAddrs[nextAddr]
			nextAddr = (nextAddr + 1) % len(splitAddrs)
			mx.Unlock()

			// get current auth user and
			// pass it on as custom user header
			user, _ := getUser(r, ctx)
			if user == nil {
				r.Header.Del(headerXUser)
			} else {
				userjson, _ := json.Marshal(user)
				r.Header.Add(headerXUser, string(userjson))
			}
		},
	}
}

// getUser returns the currently-authenticated user,
// or an error if the user is not authenticated.
func getUser(r *http.Request, ctx *Context) (*users.User, error) {
	ss := &SessionState{}

	_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
	if err != nil {
		return nil, err
	}
	return ss.User, nil
}
