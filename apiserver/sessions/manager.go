package sessions

import (
	"errors"
	"net/http"
)

const headerSessionID = "X-Session-ID"

//ErrNoSessionID is returned when no session token header was provided in the request
var ErrNoSessionID = errors.New("No session ID provided with request")

//Manager manages sessions for a web application.
type Manager struct {
	signingKey string
	store      Store
}

//NewManager constructs a new Manager.
func NewManager(signingKey string, store Store) *Manager {
	//return a new *Manager with the fields set to the parameters
	return nil
}

//GetState extracts the session token from the request, validates the session ID,
//fetches the session state from the store into the `state` parameter, and returns
//the validated SessionID. If no session token was provided with the request, it
//returns sessions.ErrNoSessionID. If the cookie was provided, but the session ID was invalid,
//it returns sessions.ErrInavlidID. If the session ID was valid but nothing was found
//in the session store, it returns sessions.ErrStateNotFound.
func (m *Manager) GetState(w http.ResponseWriter, r *http.Request, state interface{}) (SessionID, error) {
	//the SessionID will be in the "X-Session-ID" header in the form:
	//  X-Session-ID: <SessionID>
	//where <SessionID> will be the full base64-encoded SessionID (ID+MAC)

	//get the X-Session-ID header value
	//if the value is zero-length return InvalidSessionID and ErrNoSessionID

	//validate the SessionID
	//if you get an error, return InvalidSessionID and the error

	//get the state from m.store
	//if you get an error, return the validated SessionID and the error

	//add a response header in the form of:
	//  X-Session-ID: <SessionID>
	//where <SessionID> is replaced with the validated SessionID

	//if you get to here, all is good, so
	//return the validated SessionID and nil

	return InvalidSessionID, ErrNoSessionID
}

//BeginSession generates a new SessionID, saves the provided `state` into the session
//store, sets a response header containing the new SessionID, and returns that SessionID.
//Errors are returned if there was not enough randomness to generate a new SessionID,
//or if saving to the session store failed.
func (m *Manager) BeginSession(w http.ResponseWriter, state interface{}) (SessionID, error) {
	//create a NewSessionID(), passing the m.signingKey
	//if you get an error, return it

	//save the `state` to m.store
	//if you get an error, return InvalidSessionID and the error

	//add a response header in the form of:
	//  X-Session-ID: <SessionID>
	//where <SessionID> is replaced with the validated SessionID

	//return the new SessionID and nil
	return InvalidSessionID, nil
}

//SaveState saves the `state` parameter to the session store,
//associated with the provided SessionID.
func (m *Manager) SaveState(sid SessionID, state interface{}) error {
	//use m.store to save the `state` and return an errors that occurred
	return nil
}
