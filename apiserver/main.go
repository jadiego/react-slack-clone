package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	redis "gopkg.in/redis.v5"

	"github.com/info344-s17/challenges-jadiego/apiserver/handlers"
	"github.com/info344-s17/challenges-jadiego/apiserver/middleware"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/messages"
	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
	"github.com/info344-s17/challenges-jadiego/apiserver/sessions"
	"github.com/info344-s17/challenges-jadiego/apiserver/websocket"
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

//main is the main entry point for this program
func main() {
	//read and use the following environment variables
	//when initializing and starting your web server
	// PORT - port number to listen on for HTTP requests (if not set, use defaultPort)
	// HOST - host address to respond to (if not set, leave empty, which means any host)
	// SESSIONKEY - a string to use as the session ID singing key
	// REDISADDR - the address of your redis session store
	// DBADDR - the address of your database server
	port := os.Getenv("PORT")
	if len(port) == 0 {
		fmt.Println("Port number not set. Defaulting to port: " + defaultPort)
		port = defaultPort
	}
	host := os.Getenv("HOST")
	if len(host) == 0 {
		fmt.Println("Host not set. Defaulting to empty host")
		host = ""
	}
	addr := fmt.Sprintf("%s:%s", host, port)

	//Set Redis
	redisAddr := os.Getenv("REDISADDR")
	if len(redisAddr) == 0 {
		fmt.Println("Redis address not set. Defaulting to port: " + defaultRedisPort)
		redisAddr = defaultRedisPort
	}
	rclient := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	rstore := sessions.NewRedisStore(rclient, -1)

	dbAddr := os.Getenv("DBADDR")
	if len(dbAddr) == 0 {
		fmt.Println("DB address not set. Defaulting to port: " + defaultMongoPort)
		dbAddr = defaultMongoPort
	}
	//Set Users DB
	udbstore, err := users.NewMongoStore(dbAddr, "", "")
	if err != nil {
		log.Fatalf("error starting users DB: %v", err.Error())
	}
	defer udbstore.Session.Close()
	//Set Messages DB
	//Ensure atleast one public channel named "general"
	//to ensure users have somewhere to post messages

	mdbstore, err := messages.NewMongoStore(dbAddr, "", "", "")
	if err != nil {
		log.Fatalf("error starting messages DB: %v", err.Error())
	}
	defer mdbstore.Session.Close()

	//Get sessionkey
	sesskey := os.Getenv("SESSIONKEY")

	//Initialize context
	ctx := &handlers.Context{
		SessionKey:   sesskey,
		SessionStore: rstore,
		UserStore:    udbstore,
		MessageStore: mdbstore,
		Notifier:     notifier.NewNotifier(),
	}

	go ctx.Notifier.Start()

	//get the TLS key and cert paths from environment variables
	//this allows us to use a self-signed cert/key during development
	//and the Let's Encrypt cert/key in production
	tlsKeyPath := os.Getenv("TLSKEY")
	tlsCertPath := os.Getenv("TLSCERT")
	if len(tlsCertPath) == 0 || len(tlsKeyPath) == 0 {
		log.Fatal("you must supply a value for TLS key and cert paths")
	}

	chatbotAddr := os.Getenv("CHATBOTADDR")
	if len(chatbotAddr) == 0 {
		log.Fatal("you must supply a value for CHATBOTADDR")
	}

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
