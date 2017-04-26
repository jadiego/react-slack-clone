package handlers

import (
	"encoding/json"
	"net/http"

	"time"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
	"github.com/info344-s17/challenges-jadiego/apiserver/sessions"
)

//UsersHandler allows new users to sign up (POST) or returns all users
func (ctx *Context) UsersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		if r.Body == nil {
			http.Error(w, "Please send a request body", http.StatusBadRequest)
			return
		}

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
		if _, err := ctx.UserStore.GetByEmail(nu.Email); err != users.ErrUserNotFound {
			http.Error(w, "email address is already used:"+nu.Email, http.StatusBadRequest)
			return
		}

		//Ensure there isn't already a user in the UserStore with the same user name
		if _, err := ctx.UserStore.GetByUserName(nu.UserName); err != users.ErrUserNotFound {
			http.Error(w, "username is already used:"+nu.UserName, http.StatusBadRequest)
			return
		}

		//Insert the new user into the UserStore
		u, err := ctx.UserStore.Insert(nu)
		if err != nil {
			http.Error(w, "error inserting user into DB:"+err.Error(), http.StatusBadRequest)
			return
		}

		//Begin a new session
		ss := &SessionState{
			BeganAt:    time.Now(),
			ClientAddr: r.RemoteAddr,
			User:       u,
		}

		_, err = sessions.BeginSession(ctx.SessionKey, ctx.SessionStore, ss, w)
		if err != nil {
			http.Error(w, "error beginning session:"+err.Error(), http.StatusInternalServerError)
			return
		}

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
			http.Error(w, "Incorrect username or password", http.StatusUnauthorized)
			return
		}

		//Authenticate the user using the provided password; if that fails,
		//respond with an http.StatusUnauthorized
		if err := u.Authenticate(c.Password); err != nil {
			http.Error(w, "Incorrect username or password", http.StatusUnauthorized)
			return
		}

		//Begin a new session
		s := &SessionState{
			BeganAt:    time.Now(),
			ClientAddr: r.RemoteAddr,
			User:       u,
		}
		_, err = sessions.BeginSession(ctx.SessionKey, ctx.SessionStore, s, w)
		if err != nil {
			http.Error(w, "error beginning session:"+err.Error(), http.StatusInternalServerError)
			return
		}

		//Respond to the client with the models.User struct encoded as a JSON object
		w.Header().Add(headerContentType, contentTypeJSONUTF8)
		encoder := json.NewEncoder(w)
		encoder.Encode(u)
	}
}

//SessionsMineHandler allows authenticated users to sign-out
func (ctx *Context) SessionsMineHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		//end the sessions
		_, err := sessions.EndSession(r, ctx.SessionKey, ctx.SessionStore)
		if err != nil {
			http.Error(w, "error deleting session id:"+err.Error(), http.StatusInternalServerError)
			return
		}

		//Respond to the client with a simple message saying
		//that the user has been signed out
		w.Header().Add(headerContentType, contentTypeText)
		w.Write([]byte("User has signed out"))
	}
}

//UsersMeHanlder gets the session state
func (ctx *Context) UsersMeHanlder(w http.ResponseWriter, r *http.Request) {
	//get the session state
	ss := &SessionState{}
	sessions.GetState(r, ctx.SessionKey, ctx.SessionStore, ss)

	//Respond to the client with the session
	//state's User field, encoded as a JSON object
	w.Header().Add(headerContentType, contentTypeJSONUTF8)
	encoder := json.NewEncoder(w)
	encoder.Encode(ss.User)
}
