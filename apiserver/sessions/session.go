package sessions

import (
	"errors"
	"net/http"
)

const headerAuthorization = "Authorization"
const schemeBearer = "Bearer "

//ErrNoSessionID is used when no session ID was found in the Authorization header
var ErrNoSessionID = errors.New("no session ID found in " + headerAuthorization + " header")

//ErrInvalidScheme is used when the authorization scheme is not supported
var ErrInvalidScheme = errors.New("scheme used in Authorization header is not supported")

//BeginSession creates a new session ID, saves the state to the store, adds a
//header to the response with the session ID, and returns the new session ID
func BeginSession(signingKey string, store Store, state interface{}, w http.ResponseWriter) (SessionID, error) {
	//create a new SessionID
	//if you get an error, return InvalidSessionID and the error

	//save the state to the store
	//if you get an error, return InvalidSessionID and the error

	//Add a response header like this:
	//  Authorization: Bearer <sid>
	//where <sid> is the new SessionID

	//return the new SessionID and nil
	return InvalidSessionID, nil
}

//GetSessionID extracts and validates the SessionID from the request headers
func GetSessionID(r *http.Request, signingKey string) (SessionID, error) {
	//get the value of the Authorization header

	//if it's zero-length, return InvalidSessionID and ErrNoSessionID

	//if it doesn't start with "Bearer ",
	//return InvalidSessionID and ErrInvalidScheme

	//trim off the "Bearer " prefix and validate the remaining id
	//if you get an error return InvalidSessionID and the error

	//return the validated SessionID and nil
	return InvalidSessionID, nil
}

//GetState extracts the SessionID from the request,
//and gets the associated state from the provided store
func GetState(r *http.Request, signingKey string, store Store, state interface{}) (SessionID, error) {
	//get the SessionID from the request
	//if you get an error, return the SessionID and error

	//get the associated state data from the provided store
	//if you get an error return the SessionID and the error

	//return the SessionID and nil
	return InvalidSessionID, nil
}

//EndSession extracts the SessionID from the request,
//and deletes the associated data in the provided store
func EndSession(r *http.Request, signingKey string, store Store) (SessionID, error) {
	//get the SessionID from the request
	//if you get an error return the SessionID and error

	//delete the associated data in the provided store

	//return the SessionID and nil
	return InvalidSessionID, nil
}
