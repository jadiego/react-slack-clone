package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/info344-s17/challenges-jadiego/apiserver/handlers"
)

const defaultPort = "443"

const (
	apiRoot    = "/v1/"
	apiSummary = apiRoot + "summary"
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

	redisAddr := os.Getenv("REDISADDR")
	if len(redisAddr) == 0 {
		fmt.Println("Redis address not set. Defaulting to empty host and default port")
		redisAddr = fmt.Sprintf("%s:%s")
	}

	//get the TLS key and cert paths from environment variables
	//this allows us to use a self-signed cert/key during development
	//and the Let's Encrypt cert/key in production
	tlsKeyPath := os.Getenv("TLSKEY")
	tlsCertPath := os.Getenv("TLSCERT")

	//add your handlers.SummaryHandler function as a handler
	//for the apiSummary route
	//HINT: https://golang.org/pkg/net/http/#HandleFunc
	http.HandleFunc(apiSummary, handlers.SummaryHandler)

	//start your web server and use log.Fatal() to log
	//any errors that occur if the server can't start
	//HINT: https://golang.org/pkg/net/http/#ListenAndServe
	fmt.Printf("server is listening at %s:%s...\n", host, port)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, nil))

}
