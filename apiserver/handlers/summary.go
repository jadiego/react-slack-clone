package handlers

import (
	"net/http"
)

//openGraphPrefix is the prefix used for Open Graph meta properties
const openGraphPrefix = "og:"

//openGraphProps represents a map of open graph property names and values
type openGraphProps map[string]string

func getPageSummary(url string) (openGraphProps, error) {
	//Get the URL
	//If there was an error, return it

	//ensure that the response body stream is closed eventually
	//HINTS: https://gobyexample.com/defer
	//https://golang.org/pkg/net/http/#Response

	//if the response StatusCode is >= 400
	//return an error with an appropriate message

	//if the response's Content-Type header is not `text/html`
	//return an error with an appropriate message

	//create a new openGraphProps map instance to hold
	//the Open Graph properties you find
	//(see type definition above)

	//tokenize the response body's HTML and extract
	//any Open Graph properties you find into the map,
	//using the Open Graph property name as the key, and the
	//corresponding content as the value.
	//strip the openGraphPrefix from the property name before
	//you add it as a new key, so that the key is just `title`
	//and not `og:title` (for example).

	//HINTS: http://golang-examples.tumblr.com/post/47426518779/parse-html
	//https://godoc.org/golang.org/x/net/html

	return nil, nil

}

//SummaryHandler fetches the URL in the `url` query string parameter, extracts
//summary information about the returned page and sends those summary properties
//to the client as a JSON-encoded object.
func SummaryHandler(w http.ResponseWriter, r *http.Request) {
	//get the `url` query string parameter
	//if you use r.FormValue() it will also handle cases where
	//the client did POST with `url` as a form field
	//HINT: https://golang.org/pkg/net/http/#Request.FormValue

	//if no `url` parameter was provided, respond with
	//an http.StatusBadRequest error and return
	//HINT: https://golang.org/pkg/net/http/#Error

	//call getPageSummary() passing the requested URL
	//and holding on to the returned openGraphProps map
	//(see type definition above)

	//if you get back an error, respond to the client
	//with that error and an http.StatusBadRequest code

	//otherwise, respond by writing the openGrahProps
	//map as a JSON-encoded object

}
