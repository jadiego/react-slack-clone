package notifier

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

//Event types for websocket events
const (
	NewChannel        = "new channel"
	NewUser           = "new user"
	NewMessage        = "new message"
	UpdatedChannel    = "updated channel"
	UpdatedMessage    = "updated message"
	DeletedChannel    = "deleted channel"
	DeletedMessage    = "deleted message"
	UserJoinedChannel = "user joined channel"
	UserLeftChannel   = "user left channel"
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

//NewNotifier constructs a new Notifer.
func NewNotifier() *Notifier {
	//create, initialize and return
	//a Notifier struct
	return &Notifier{
		eventq:  make(chan interface{}, 1000),
		clients: make(map[*websocket.Conn]bool),
		mu:      sync.RWMutex{},
	}
}

//Start begins a loop that checks for new events
//and broadcasts them to all web socket clients.
//This function should be called on a new goroutine
//e.g., `go mynotifer.Start()`
func (n *Notifier) Start() {
	//this should check for new events written
	//to the `eventq` channel, and broadcast
	//them to all of the web socket clients
	for {
		n.broadcast(<-n.eventq)
	}
}

//AddClient adds a new web socket client to the Notifer
func (n *Notifier) AddClient(client *websocket.Conn) {
	//this will be called from
	//an HTTP handler, and each HTTP request is
	//processed on its own goroutine, so your
	//implementation here MUST be safe for concurrent use
	n.mu.Lock()
	defer n.mu.Unlock()

	//after you add the client to the map,
	//call n.readPump() on its own goroutine
	//to proces all of the control messages sent
	//by the client to the server.
	//see https://godoc.org/github.com/gorilla/websocket#hdr-Control_Messages
	n.clients[client] = false
	go n.readPump(client)

}

//Notify will add a new event to the event queue
func (n *Notifier) Notify(event interface{}) {
	n.eventq <- event
}

//readPump will read all messages (including control messages)
//send by the client and ignore them. This is necessary in order
//process the control messages. If you don't do this, the
//websocket will get stuck and start producing errors.
//see https://godoc.org/github.com/gorilla/websocket#hdr-Control_Messages
func (n *Notifier) readPump(client *websocket.Conn) {
	//Control Message section of the Gorilla Web Socket docs:
	//https://godoc.org/github.com/gorilla/websocket#hdr-Control_Messages
	for {
		if _, _, err := client.NextReader(); err != nil {
			client.Close()
			break
		}
	}
}

//broadcast sends the event to all client as a JSON-encoded object
func (n *Notifier) broadcast(event interface{}) {
	//Loop over all of the web socket clients in
	//n.clients and write the `event` parameter to the client
	//as a JSON-encoded object.
	//HINT: https://godoc.org/github.com/gorilla/websocket#Conn.WriteJSON
	//and for even better performance, try using a PreparedMessage:
	//https://godoc.org/github.com/gorilla/websocket#PreparedMessage
	//https://godoc.org/github.com/gorilla/websocket#Conn.WritePreparedMessage
	for key := range n.clients {
		err := key.WriteJSON(event)
		//If you get an error while writing to a client,
		//the client has wandered off, so you should call
		//the `.Close()` method on the client, and delete
		//it from the n.clients map
		if err != nil {
			key.Close()
			delete(n.clients, key)
		}
	}
}
