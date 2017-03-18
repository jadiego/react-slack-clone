package sessions

import (
	"crypto/sha256"
	"errors"
)

//InvalidSessionID represents an empty, invalid session ID
const InvalidSessionID SessionID = ""

const idLength = 32
const signedLength = idLength + sha256.Size

//SessionID represents a valid, digitally-signed session ID
type SessionID string

//ErrInvalidID is returned when an invalid session id is passed to ValidateID()
var ErrInvalidID = errors.New("Invalid Session ID")

//NewSessionID creates and returns a new digitally-signed session ID,
//using `signingKey` as the HMAC signing key. An error is returned only
//if there was an error generating random bytes for the session ID
func NewSessionID(signingKey string) (SessionID, error) {
	//make a byte slice of length `signedLength`

	//use the crypto/rand package to read `idLength`
	//random bytes into the first part of that byte slice
	//this will be our new session ID
	//if you get an error, return InvalidSessionID and
	//the error

	//use the crypto/hmac package to generate a new
	//Message Authentication Code (MAC) for the new
	//session ID, using the provided signing key,
	//and put it in the last part of the byte slice

	//use the encoding/base64 package to encode the
	//byte slice into a base64.URLEncoding
	//and return the result as a new SessionID

	return InvalidSessionID, ErrInvalidID
}

//ValidateID validates the `id` parameter using the `signingKey`
//and returns an error if invalid, or a SignedID if valid
func ValidateID(id string, signingKey string) (SessionID, error) {
	//use the encoding/base64 package to base64-decode
	//the `id` string into a byte slice
	//if you get an error, return InvalidSessionID and the error

	//if the byte slice length is < signedLength
	//it must be invalid, so return InvalidSessionID
	//and ErrInvalidID

	//generate a new MAC for ID portion of the byte slice
	//using the provided `signingKey` and compare that to
	//the MAC that is in the second part of the byte slice
	//use hmac.Equal() to compare the two MACs
	//if they are not equal, return InvalidSessionID
	//and ErrInvalidID

	//the session ID is valid, so return it as a SessionID
	//with nil for the error
	return InvalidSessionID, ErrInvalidID
}

//String returns a string representation of the sessionID
func (sid SessionID) String() string {
	//just return the `sid` as a string
	//HINT: https://tour.golang.org/basics/13
	return ""
}
