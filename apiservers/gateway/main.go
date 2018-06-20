package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-redis/redis"
	"github.com/jadiego/react-slack-clone/apiservers/gateway/handlers"
	"github.com/jadiego/react-slack-clone/apiservers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/apiservers/gateway/sessions"
	"github.com/jadiego/react-slack-clone/apiservers/middleware"
)

const (
	defaultPort      = "443"
	defaultRedisPort = "6379"
	defaultMongoPort = "27017"
)

const (
	apiRoot         = "/v1/"
	apiSummary      = apiRoot + "summary"
	apiUsers        = apiRoot + "users"
	apiSessions     = apiRoot + "sessions"
	apiSessionsMine = apiSessions + "/mine"
	apiUsersMe      = apiUsers + "/me"
	// apiChannels     = apiRoot + "channels"
	// apiMessages         = apiRoot + "messages"
	// apiWebSocket        = apiRoot + "websocket"
	// apiChatBot          = apiRoot + "bot"
	// apiSpecificChannels = apiChannels + "/"
	// apiSpecificMessages = apiMessages + "/"
)

var (
	port      = os.Getenv("PORT")
	host      = os.Getenv("HOST")
	redisAddr = os.Getenv("REDISADDR")
	dbAddr    = os.Getenv("DBADDR")
	// chatbotAddr = os.Getenv("CHATBOTADDR")
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
	// if len(chatbotAddr) == 0 {
	// 	log.Fatal("you must supply a value for CHATBOTADDR")
	// }
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

	ctx := handlers.NewHandlerContext(sesskey, rstore, udbstore)

	// set up routes
	mux := http.NewServeMux()
	muxWithMiddleware := http.NewServeMux()
	muxWithMiddleware.HandleFunc(apiUsers, ctx.UsersHandler)
	muxWithMiddleware.HandleFunc(apiSessions, ctx.SessionsHandler)
	muxWithMiddleware.HandleFunc(apiSessionsMine, ctx.SessionsMineHandler)
	muxWithMiddleware.HandleFunc(apiUsersMe, ctx.UsersMeHanlder)

	// set up middleware
	logger := log.New(os.Stdout, "", log.LstdFlags)
	loggerMidware := middleware.Notify(logger)
	corsMidwarre := middleware.CORS("", "", "", "", "")
	mux.Handle(apiRoot, middleware.Adapt(muxWithMiddleware, loggerMidware, corsMidwarre))

	fmt.Printf("API gateway is listening at %s...\n", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, mux))
}
