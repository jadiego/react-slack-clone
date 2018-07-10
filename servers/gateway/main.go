package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-redis/redis"
	"github.com/jadiego/react-slack-clone/servers/gateway/handlers"
	"github.com/jadiego/react-slack-clone/servers/gateway/middleware"
	"github.com/jadiego/react-slack-clone/servers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/servers/gateway/mq"
	"github.com/jadiego/react-slack-clone/servers/gateway/sessions"
)

const (
	defaultPort         = "443"
	defaultRedisPort    = "6379"
	defaultMongoPort    = "27017"
	defaultRabbitMQPort = "5672"
)

const (
	apiRoot             = "/v1/"
	apiUsers            = apiRoot + "users"
	apiSessions         = apiRoot + "sessions"
	apiSessionsMine     = apiSessions + "/mine"
	apiUsersMe          = apiUsers + "/me"
	apiChannels         = apiRoot + "channels"
	apiMessages         = apiRoot + "messages"
	apiSpecificChannels = apiChannels + "/"
	apiSpecificMessages = apiMessages + "/"
	apiWebSocket        = apiRoot + "websocket"
	apiChatBot          = apiRoot + "bot"
)

var (
	port        = os.Getenv("PORT")
	host        = os.Getenv("HOST")
	redisAddr   = os.Getenv("REDISADDR")
	dbAddr      = os.Getenv("DBADDR")
	mqAddr      = os.Getenv("MQADDR")
	chatbotAddr = os.Getenv("CHATBOTADDR")
	msgAddrs    = os.Getenv("MSGADDR")
	sesskey     = os.Getenv("SESSIONKEY")
	tlsKeyPath  = os.Getenv("TLSKEY")
	tlsCertPath = os.Getenv("TLSCERT")
	chatEnv     = os.Getenv("CHAT_ENV")
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
	if len(mqAddr) == 0 {
		fmt.Println("MQ address not set. Defaulting to port: " + defaultMongoPort)
		dbAddr = defaultMongoPort
	}
	if len(msgAddrs) == 0 {
		log.Fatal("you must supply a value for MSGADDR")
	}
	if len(chatbotAddr) == 0 {
		log.Fatal("you must supply a value for CHATBOTADDR")
	}
	if len(tlsCertPath) == 0 || len(tlsKeyPath) == 0 {
		log.Fatal("you must supply a value for TLS key and cert paths")
	}
}

func main() {
	addr := fmt.Sprintf("%s:%s", host, port)

	// set Redis
	rclient := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	rstore := sessions.NewRedisStore(rclient, -1)

	// set Users DB
	udbstore, err := users.NewMongoStore(dbAddr, "", "")
	if err != nil {
		log.Fatalf("error starting users DB: %v", err.Error())
	}
	defer udbstore.Session.Close()

	// setup Handler context
	ctx := handlers.NewHandlerContext(sesskey, rstore, udbstore)

	/// set up middleware
	logger := log.New(os.Stdout, "", log.LstdFlags)
	loggerMidware := middleware.Notify(logger)
	corsMidwarre := middleware.CORS("", "", "", "", "")

	// setup User Routes
	mux := http.NewServeMux()
	muxWithMiddleware := http.NewServeMux()
	muxWithMiddleware.HandleFunc(apiUsers, ctx.UsersHandler)
	muxWithMiddleware.HandleFunc(apiSessions, ctx.SessionsHandler)
	muxWithMiddleware.HandleFunc(apiSessionsMine, ctx.SessionsMineHandler)
	muxWithMiddleware.HandleFunc(apiUsersMe, ctx.UsersMeHanlder)

	// setup Messages microservice routes
	muxWithMiddleware.Handle(apiChannels, handlers.NewServiceProxy(msgAddrs, ctx))
	muxWithMiddleware.Handle(apiSpecificChannels, handlers.NewServiceProxy(msgAddrs, ctx))
	muxWithMiddleware.Handle(apiMessages, handlers.NewServiceProxy(msgAddrs, ctx))
	muxWithMiddleware.Handle(apiSpecificMessages, handlers.NewServiceProxy(msgAddrs, ctx))

	// setup Chatbot microservice route
	muxWithMiddleware.Handle(apiChatBot, handlers.NewServiceProxy(chatbotAddr, ctx))

	// create a new Notifer and set up websocket handler
	notifier := handlers.NewNotifier()
	mux.Handle(apiWebSocket, ctx.NewWebSocketsHandler(notifier))

	// subscribe to rabbitMQ queue and dispatch messages to webscket clients
	go mq.ListenToMessagingMQ(mqAddr, notifier)

	mux.Handle(apiRoot, middleware.Adapt(muxWithMiddleware, loggerMidware, corsMidwarre))
	fmt.Printf("API gateway is listening at %s...\n", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, mux))
}
