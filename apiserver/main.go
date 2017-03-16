package main

const defaultPort = "80"

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

	//create a NewServeMux() to be the main server router
	//although this isn't strictly necessary at this stage,
	//it will make things much easier when we start adding
	//middleware and authenticated APIs
	//HINT: https://golang.org/pkg/net/http/#NewServeMux

	//add your handlers.SummaryHandler function as a handler
	//for the apiSummary route
	//HINT: https://golang.org/pkg/net/http/#ServeMux.HandleFunc

	//start your web server, passing the main server mux
	//as the handler for all requests
	//HINT: https://golang.org/pkg/net/http/#ListenAndServe

}
