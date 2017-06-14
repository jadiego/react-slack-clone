package handlers

import (
	"time"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
)

//SessionState defines a session state that contains atleast
//BeganAt(a time that will record when the session began),
//ClientAddr(records the host address of the client that began session),
//and User(a user that will record the authenticated user)
type SessionState struct {
	BeganAt    time.Time
	ClientAddr string
	User       *users.User
}
