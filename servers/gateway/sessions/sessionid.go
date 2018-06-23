package sessions

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
)

// InvalidSessionID represents an empty, invalid session ID
const InvalidSessionID SessionID = ""

// idLength is the length of the ID portion
const idLength = 32

// signedLength is the full length of the signed session ID
// (ID portion plus signature)
const signedLength = idLength + sha256.Size

// SessionID represents a valid, digitally-signed session ID.
// This is a base64 URL encoded string created from a byte slice
// where the first `idLength` bytes are crytographically random
// bytes representing the unique session ID, and the remaining bytes
// are an HMAC hash of those ID bytes (i.e., a digital signature).
// The byte slice layout is like so:
// +-----------------------------------------------------+
// |...32 crypto random bytes...|HMAC hash of those bytes|
// +-----------------------------------------------------+
type SessionID string

// ErrInvalidID is returned when an invalid session id is passed to ValidateID()
var ErrInvalidID = errors.New("Invalid Session ID")

// ErrInvalidSigningKey is returned when an invalid session id is passed to NewSessionID()
var ErrInvalidSigningKey = errors.New("Invalid SigningKey")

// NewSessionID creates and returns a new digitally-signed session ID,
// using `signingKey` as the HMAC signing key. An error is returned only
// if there was an error generating random bytes for the session ID
func NewSessionID(signingKey string) (SessionID, error) {
	if len(signingKey) == 0 {
		return InvalidSessionID, ErrInvalidSigningKey
	}

	// make a byte slice of length `signedLength`
	buf := make([]byte, signedLength)

	// use the crypto/rand package to read `idLength`
	// random bytes into the first part of that byte slice
	// this will be our new session ID
	// if you get an error, return InvalidSessionID and
	// the error
	_, err := rand.Read(buf[:idLength])
	if err != nil {
		return InvalidSessionID, err
	}

	// use the crypto/hmac package to generate a new
	// Message Authentication Code (MAC) for the new
	// session ID, using the provided signing key,
	// and put it in the last part of the byte slice
	h := hmac.New(sha256.New, []byte(signingKey))
	h.Write(buf[:idLength])
	sig := h.Sum(nil)
	copy(buf[idLength:], sig)

	// use the encoding/base64 package to encode the
	// byte slice into a base64.URLEncoding
	// and return the result as a new SessionID
	sid := SessionID(base64.URLEncoding.EncodeToString(buf))
	return sid, nil

}

// ValidateID validates the `id` parameter using the `signingKey`
// and returns an error if invalid, or a SignedID if valid
func ValidateID(id string, signingKey string) (SessionID, error) {
	// use the encoding/base64 package to base64-decode
	// the `id` string into a byte slice
	// if you get an error, return InvalidSessionID and the error
	buf, err := base64.URLEncoding.DecodeString(id)
	if err != nil {
		return InvalidSessionID, err
	}

	//if the byte slice length is < signedLength
	//it must be invalid, so return InvalidSessionID
	//and ErrInvalidID
	if len(buf) < signedLength {
		return InvalidSessionID, ErrInvalidID
	}

	// generate a new MAC for ID portion of the byte slice
	// using the provided `signingKey` and compare that to
	// the MAC that is in the second part of the byte slice
	// use hmac.Equal() to compare the two MACs
	sig1 := buf[idLength:]
	h := hmac.New(sha256.New, []byte(signingKey))
	v := buf[:idLength]
	h.Write(v)
	sig2 := h.Sum(nil)
	if hmac.Equal(sig1, sig2) {
		return SessionID(id), nil
	}

	// the session ID is invalid, so return InvalidSessionID
	// and ErrInvalidID
	return InvalidSessionID, ErrInvalidID
}

// String returns a string representation of the sessionID
func (sid SessionID) String() string {
	return string(sid)
}
