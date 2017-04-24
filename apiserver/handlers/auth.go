package handlers

import (
	"encoding/json"
	"net/http"

	"time"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
	"github.com/info344-s17/challenges-jadiego/apiserver/sessions"
)

//TODO: Define Handlers for Sign-Up, Sign-In, and Sign-Out
//Now you're ready to implement the Handlers for sign-up, sign-in, and sign-out,
//as well as one that returns the authenticated user.
//Create a new file at apiserver/handlers/auth.go. In that file, create these four HTTP
//handler functions, and on all of them, use a receiver of type *Context. For example:

//UsersHandler allows new users to sign up (POST) or returns all users
func (ctx *Context) UsersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		//Decode the request body into a models.NewUser struct
		d := json.NewDecoder(r.Body)
		nu := &users.NewUser{}
		if err := d.Decode(nu); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		//Validate the models.NewUser
		if err := nu.Validate(); err != nil {
			http.Error(w, "error validating user:"+err.Error(), http.StatusBadRequest)
			return
		}

		//Ensure there isn't already a user in the UserStore with the same email address
		if _, err := ctx.UserStore.GetByEmail(r.FormValue("email")); err != nil {
			http.Error(w, "email address is already used:"+err.Error(), http.StatusBadRequest)
			return
		}

		//Ensure there isn't already a user in the UserStore with the same user name
		if _, err := ctx.UserStore.GetByEmail(r.FormValue("userName")); err != nil {
			http.Error(w, "username is already used:"+err.Error(), http.StatusBadRequest)
			return
		}

		//Insert the new user into the UserStore
		u, err := ctx.UserStore.Insert(nu)
		if err != nil {
			http.Error(w, "error inserting user:"+err.Error(), http.StatusBadRequest)
			return
		}

		//TODO: not sure if this is correct implementation
		//Begin a new session
		s := &SessionState{
			BeganAt:    time.Now(),
			ClientAddr: r.RemoteAddr,
			User:       u,
		}
		sid, err := sessions.BeginSession(u.Email, ctx.SessionStore, s, w)
		if err != nil {
			http.Error(w, "error beginning session:"+err.Error(), http.StatusInternalServerError)
			return
		}
		ctx.SessionKey = sid.String()

		//Respond to the client with the models.User struct encoded as a JSON object
		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(u)

	case "GET":
		//Get all users from the UserStore and write them
		//to the response as a JSON-encoded array
		us, err := ctx.UserStore.GetAll()
		if err != nil {
			http.Error(w, "error getting users: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(us)
	}
}

//SessionsHandler allows existing users to sign-in
func (ctx *Context) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		//Decode the request body into a models.Credentials struct
		d := json.NewDecoder(r.Body)
		c := &users.Credentials{}
		if err := d.Decode(c); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		//Get the user with the provided email from the UserStore; if not found,
		//respond with an http.StatusUnauthorized
		u, err := ctx.UserStore.GetByEmail(c.Email)
		if err != nil {
			http.Error(w, "Incorrect username or password: "+err.Error(), http.StatusUnauthorized)
			return
		}

		//Authenticate the user using the provided password; if that fails,
		//respond with an http.StatusUnauthorized
		if err := u.Authenticate(c.Password); err != nil {
			http.Error(w, "Incorrect username or password: "+err.Error(), http.StatusUnauthorized)
			return
		}

		//Begin a new session

		//Respond to the client with the models.User struct encoded as a JSON object
	}
}
