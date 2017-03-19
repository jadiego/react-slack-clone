package handlers

import "net/http"

//SessionsMineHandler will handle the `/v1/sessions/mine` API
func SessionsMineHandler(w http.ResponseWriter, r *http.Request) {
	//if the request method is something other than GET
	//respond with a http.StatusMethodNotAllowed error
	//and return

	//get the SessionState from the request context

	//write the session state back to the client,
	//encoded as a JSON object
}
