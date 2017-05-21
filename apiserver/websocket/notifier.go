package notifier

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

//UserEvent represents an event with messages about
//user related events
type UserEvent struct {
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

//ChannelEvent represents an event with messages about
//user related events
type ChannelEvent struct {
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

//MessageEvent represents an event with messages about
//user related events
type MessageEvent struct {
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

//Notifier represetns a web sockets notifier
type Notifier struct {
	eventq  chan interface{}
	clients map[*websocket.Conn]bool
	mu      sync.RWMutex
}
