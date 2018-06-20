package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jadiego/react-slack-clone/apiserver/handlers"
	"github.com/jadiego/react-slack-clone/apiserver/middleware"
	"github.com/jadiego/react-slack-clone/apiserver/models/messages"
	"github.com/jadiego/react-slack-clone/apiserver/models/users"
	"github.com/jadiego/react-slack-clone/apiserver/sessions"
	"github.com/jadiego/react-slack-clone/apiserver/websocket"
	redis "gopkg.in/redis.v5"
)

const (
	defaultPort      = "443"
	defaultRedisPort = "6379"
	defaultMongoPort = "27017"
)

const (
	apiRoot             = "/v1/"
	apiSummary          = apiRoot + "summary"
	apiUsers            = apiRoot + "users"
	apiSessions         = apiRoot + "sessions"
	apiChannels         = apiRoot + "channels"
	apiMessages         = apiRoot + "messages"
	apiWebSocket        = apiRoot + "websocket"
	apiChatBot          = apiRoot + "bot"
	apiSpecificChannels = apiChannels + "/"
	apiSpecificMessages = apiMessages + "/"
	apiSessionsMine     = apiSessions + "/mine"
	apiUsersMe          = apiUsers + "/me"
)

var (
	port        = os.Getenv("PORT")
	host        = os.Getenv("HOST")
	redisAddr   = os.Getenv("REDISADDR")
	dbAddr      = os.Getenv("DBADDR")
	chatbotAddr = os.Getenv("CHATBOTADDR")
	sesskey     = os.Getenv("SESSIONKEY")
	tlsKeyPath  = os.Getenv("TLSKEY")
	tlsCertPath = os.Getenv("TLSCERT")
)

func init() {
	if len(host) == 0 {
		fmt.Println("Host not set. Defaulting to empty host")
		host = ""
	}
	if len(port) == 0 {
		fmt.Println("Port number not set. Defaulting to port: " + defaultPort)
		port = defaultPort
	}
	if len(redisAddr) == 0 {
		fmt.Println("Redis address not set. Defaulting to port: " + defaultRedisPort)
		redisAddr = defaultRedisPort
	}
	if len(dbAddr) == 0 {
		fmt.Println("DB address not set. Defaulting to port: " + defaultMongoPort)
		dbAddr = defaultMongoPort
	}
	if len(tlsCertPath) == 0 || len(tlsKeyPath) == 0 {
		log.Fatal("you must supply a value for TLS key and cert paths")
	}
	if len(chatbotAddr) == 0 {
		log.Fatal("you must supply a value for CHATBOTADDR")
	}
}

//main is the main entry point for this program
func main() {
	addr := fmt.Sprintf("%s:%s", host, port)

	//Set Redis
	rclient := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	rstore := sessions.NewRedisStore(rclient, -1)

	//Set Users DB
	udbstore, err := users.NewMongoStore(dbAddr, "", "")
	if err != nil {
		log.Fatalf("error starting users DB: %v", err.Error())
	}
	defer udbstore.Session.Close()

	//Set Messages DB
	mdbstore, err := messages.NewMongoStore(dbAddr, "", "", "")
	if err != nil {
		log.Fatalf("error starting messages DB: %v", err.Error())
	}
	defer mdbstore.Session.Close()

	//Initialize context
	ctx := &handlers.Context{
		SessionKey:   sesskey,
		SessionStore: rstore,
		UserStore:    udbstore,
		MessageStore: mdbstore,
		Notifier:     notifier.NewNotifier(),
	}

	go ctx.Notifier.Start()

	mux := http.NewServeMux()
	muxLogged := http.NewServeMux()

	muxLogged.HandleFunc(apiUsers, ctx.UsersHandler)
	muxLogged.HandleFunc(apiSessions, ctx.SessionsHandler)
	muxLogged.HandleFunc(apiSessionsMine, ctx.SessionsMineHandler)
	muxLogged.HandleFunc(apiUsersMe, ctx.UsersMeHanlder)
	muxLogged.HandleFunc(apiChannels, ctx.ChannelsHandler)
	muxLogged.HandleFunc(apiSpecificChannels, ctx.SpecificChannelHandler)
	muxLogged.HandleFunc(apiMessages, ctx.MessageHandler)
	muxLogged.HandleFunc(apiSpecificMessages, ctx.SpecificMessageHandler)

	//add your handlers.SummaryHandler function as a handler
	//for the apiSummary route
	//HINT: https://golang.org/pkg/net/http/#HandleFunc
	mux.HandleFunc(apiSummary, handlers.SummaryHandler)
	mux.HandleFunc(apiWebSocket, ctx.WebSocketUpgradeHandler)

	logger := log.New(os.Stdout, "", log.LstdFlags)
	mux.Handle(apiRoot, middleware.Adapt(muxLogged, middleware.CORS("", "", "", ""), middleware.Notify(logger)))

	mux.Handle(apiChatBot, ctx.GetServiceProxy(chatbotAddr, ctx.SessionKey, ctx.SessionStore))

	//start your web server and use log.Fatal() to log
	//any errors that occur if the server can't start
	//HINT: https://golang.org/pkg/net/http/#ListenAndServe
	fmt.Printf("server is listening at %s:%s...\n", host, port)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, mux))
}
