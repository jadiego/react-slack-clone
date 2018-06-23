package handlers

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/jadiego/react-slack-clone/servers/gateway/sessions"
)

// WebSocketsHandler is a handler for WebSocket upgrade requests.
type WebSocketsHandler struct {
	notifier *Notifier
	upgrader *websocket.Upgrader
	ctx      *Context
}

// NewWebSocketsHandler constructs a new WebSocketsHandler.
// By default, the websocket package will reject
// cross-origin upgrade requests, so make sure you set the
// CheckOrigin field of the Upgrader to allow upgrades from
// any origin.
// See https://godoc.org/github.com/gorilla/websocket#hdr-Origin_Considerations
func (ctx *Context) NewWebSocketsHandler(notifier *Notifier) *WebSocketsHandler {
	return &WebSocketsHandler{
		notifier: notifier,
		upgrader: &websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		},
		ctx: ctx,
	}
}

// ServeHTTP implements the http.Handler interface for the WebSocketsHandler.
func (wsh *WebSocketsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Users must be authenticated before upgrading to a WebSocket.
	sessionState := &SessionState{}
	_, err := sessions.GetState(r, wsh.ctx.SessionKey, wsh.ctx.SessionStore, sessionState)
	if err != nil {
		http.Error(w, "error getting current session: "+err.Error(), http.StatusUnauthorized)
		return
	}

	// Upgrade the connection to a WebSocket, and add the
	// new websock.Conn to the Notifier.
	conn, err := wsh.upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Each request will be running on its own goroutine,
	// and represent a different client.
	// So whenever we receive a new request, and ServeHTTP is called,
	// we need to add that request as a new client to our Notifier's clients field.
	// Note that we don't want to spawn a new goroutine here
	// because the expectation is that this upgrade request never ends,
	// as the connection is upgraded into a persistent Websocket connection.
	wsh.notifier.AddClient(conn)
}

// Notifier represetns a web sockets notifier that handles websockets notifications
type Notifier struct {
	eventq  chan []byte
	clients []*websocket.Conn
	mu      sync.Mutex
}

// NewNotifier constructs a new Notifer.
func NewNotifier() *Notifier {
	notifier := &Notifier{
		eventq: make(chan []byte),
	}
	go notifier.start()
	return notifier
}

// AddClient adds a new Websocket client to the Notifier
func (n *Notifier) AddClient(client *websocket.Conn) {
	// Add the client to the `clients` slice
	// but since this can be called from multiple
	// goroutines, make sure you protect the `clients`
	// slice while you add a new connection to it!
	n.mu.Lock()
	n.clients = append(n.clients, client)
	n.mu.Unlock()

	// Process incoming control messages from the client.
	// Once this client is added to the list, it will constantly
	// send control messages to our server. If at one point,
	// we get an error when reading those control messages,
	// it informs us that connection is lost, and we need to
	// remove it from the list.
	for {
		if _, _, err := client.NextReader(); err != nil {
			client.Close()

			n.mu.Lock()
			liveconns := n.clients[:0]
			for _, wsconn := range n.clients {
				if wsconn != client {
					liveconns = append(liveconns, wsconn)
				}
			}

			n.clients = liveconns
			n.mu.Unlock()
			break
		}
	}
}

// Notify broadcasts the event to all WebSocket clients
func (n *Notifier) Notify(event []byte) {
	n.eventq <- event
}

// start starts the event notification loop.
func (n *Notifier) start() {
	for msg := range n.eventq {
		n.mu.Lock()

		// https://github.com/golang/go/wiki/SliceTricks#filtering-without-allocating
		// cloned list of clients still connected
		liveconns := n.clients[:0]

		// Loop through all the existing clients,
		// and send messages to all of them.
		for _, wsconn := range n.clients {
			pmsg, _ := websocket.NewPreparedMessage(websocket.TextMessage, msg)

			// If we encounter an error writing messages out,
			// it means this connection is lost,
			// and we need to remove it from the list.
			err := wsconn.WritePreparedMessage(pmsg)
			if err != nil {
				wsconn.Close()
			} else {
				liveconns = append(liveconns, wsconn)
			}
		}

		n.clients = liveconns
		n.mu.Unlock()
	}
}
