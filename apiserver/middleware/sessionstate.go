package middleware

//NOTE: change the import path for the sessions package
//to match your particular path to that package
//instead of `info344-s17/challenges` it will be
//
// `github.com/info344-s17/challenges-[your-github-name]/apiserver/sessions`
//
//where `[your-github-name]` is replaced with your github user name
import (
	"context"
	"net/http"
	"time"

	"github.com/info344-s17/challenges/apiserver/sessions"
)

//SessionState represents our session state.
//Since this will be serialized to JSON, make sure
//all members are exported (capital first letter).
//The JSON encoder can only see exported fields.
type SessionState struct {
	//Requests tracks the number of requests the client has made since the last reset
	Requests int `json:"requests"`
	//Limit captures the max number of requests the client can make before the next reset
	Limit int `json:"limit"`
	//ResetAt tracks the time at which the next reset should occur
	ResetAt time.Time `json:"resetAt"`
}

//GetSessionState returns a middleware adapter that gets session state using
//the provided sessions manager
func GetSessionState(sessionsManager *sessions.Manager) Adapter {
	//return an Adapter function...
	return func(handler http.Handler) http.Handler {
		//that returns an http.Handler...
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//create a new SessionState instance

			//get session state from the `sessionsManager`
			//if you get an error, check what kind of error it is:
			// - if you get sessions.ErrNoSessionToken or sessions.ErrStateNotFound
			//   then begin a new session, and keep going
			// - if you get some other kind of error, respond with an StatusInternalServerError
			//   sending the error message and return

			//create a new request context with the SessionState as the
			//value, SessionStateContextKey as the key, and r.Context()
			//as the parent context
			//this will associate the session state with the context
			//so that handlers can retrieve it

			//call handler.ServeHTTP() passing w and r.WithContext()

			//after the handler returns, save the session state
			//using sessionsManager

			//for EXTRA CREDIT, do this save using a go routine so
			//that it's done asynchronously, and does not delay the
			//response to the client
			//report any errors to log.Errorf()
			//HINT: https://gobyexample.com/goroutines
		})
	}
}

//StateFromContext returns the *SessionState from the provided context.Context
func StateFromContext(ctx context.Context) *SessionState {
	return ctx.Value(SessionStateContextKey).(*SessionState)
}
