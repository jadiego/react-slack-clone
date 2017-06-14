package handlers

import (
	"net/http"
	"net/http/httputil"

	"encoding/json"

	"fmt"

	"github.com/info344-s17/challenges-jadiego/apiserver/sessions"
)

//GetServiceProxy returns a ReverProxy for a microservice
func (ctx *Context) GetServiceProxy(chatAddr string, signingKey string, store sessions.Store) *httputil.ReverseProxy {
	return &httputil.ReverseProxy{
		Director: func(r *http.Request) {
			ss := &SessionState{}
			_, err := sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)
			if err != nil {
				fmt.Println(err.Error())
			}

			j, err := json.Marshal(ss.User)
			if err != nil {
				fmt.Println(err.Error())
			}

			r.Header.Add(headerXUser, string(j))

			r.URL.Scheme = "http"

			r.URL.Host = chatAddr
		},
	}
}
