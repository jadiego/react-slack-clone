package sessions

import (
	"errors"
	"time"
)

// DefaultSessionDuration is the default duration for
// saving session data in the store. Most Store implementations
// will automatically delete saved session data after this time.
const DefaultSessionDuration = time.Hour * 9

// ErrStateNotFound is returned from Store.Get() when the requested
// session id was not found in the store
var ErrStateNotFound = errors.New("No session state was found")

// Store represents a session data store.
// This is an abstract interface that can be implemented
// against several different types of data stores. For example,
// session data could be stored in memory in a concurrent map,
// or more typically in a shared key/value server store like redis.
type Store interface {
	// Save saves the provided `state` and associated SessionID to the store.
	// The `state` parameter is typically a pointer to a struct containing
	// all the data you want to associated with the given SessionID.
	Save(sid SessionID, state interface{}) error

	// Get populates `state` with the data previously saved
	// for the given SessionID
	Get(sid SessionID, state interface{}) error

	// Delete deletes all state data associated with the session id from the store.
	Delete(sid SessionID) error
}
