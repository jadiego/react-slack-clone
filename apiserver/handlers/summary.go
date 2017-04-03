package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"encoding/json"

	"golang.org/x/net/html"
)

//openGraphPrefix is the prefix used for Open Graph meta properties
const openGraphPrefix = "og:"

//openGraphProps represents a map of open graph property names and values
type openGraphProps map[string]string

func getPageSummary(url string) (openGraphProps, error) {
	//Get the URL
	//If there was an error, return it
	resp, err := http.Get(url)
	if err != nil {

		return nil, err
	}

	//ensure that the response body stream is closed eventually
	//HINTS: https://gobyexample.com/defer
	//https://golang.org/pkg/net/http/#Response
	defer resp.Body.Close()

	//if the response StatusCode is >= 400
	//return an error, using the response's .Status
	//property as the error message
	if resp.StatusCode >= 400 {
		return nil,
			fmt.Errorf("invalidStatusCodeError: response status code was ==> %v",
				resp.StatusCode)
	}

	//if the response's Content-Type header does not
	//start with "text/html", return an error noting
	//what the content type was and that you were
	//expecting HTML
	ctype := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(ctype, "text/html") {
		return nil,
			fmt.Errorf("invalidContentTypeError: response content was ==> %v",
				ctype)
	}

	//create a new openGraphProps map instance to hold
	//the Open Graph properties you find
	//(see type definition above)
	properties := make(openGraphProps)

	//tokenize the response body's HTML and extract
	//any Open Graph properties you find into the map,
	//using the Open Graph property name as the key, and the
	//corresponding content as the value.
	//strip the openGraphPrefix from the property name before
	//you add it as a new key, so that the key is just `title`
	//and not `og:title` (for example).
	//ex: <meta property="og:title" content="The Rock" />
	//ex: <meta property="og:audio" content="http://example.com/bond/theme.mp3" />
	//HINTS: http://golang-examples.tumblr.com/post/47426518779/parse-html
	//https://godoc.org/golang.org/x/net/html
	d := html.NewTokenizer(resp.Body)

	for {
		//get the next token type
		tokenType := d.Next()

		token := d.Token()

		switch tokenType {
		//if it's an error token, we either reached the end of
		//the file, or the HTML was malformed
		case html.ErrorToken:
			return properties, nil

		//if its a self closing tags, i.e <meta />, examine it
		case html.SelfClosingTagToken:
			//if the self closing tag is a meta tag
			if token.Data == "meta" {

				metatag := make(map[string]string)

				for _, c := range token.Attr {
					metatag[c.Key] = c.Val

				}
				//if the metatag contains openGraphPrefix, ex: "og:blah"
				if strings.HasPrefix(metatag["property"], openGraphPrefix) {
					prop := strings.SplitN(metatag["property"], ":", 2)[1]
					cont := metatag["content"]
					properties[prop] = cont
				}

			}
		case html.EndTagToken:
			if token.Data == "head" {
				return properties, nil
			}
		}

	}
}

//SummaryHandler fetches the URL in the `url` query string parameter, extracts
//summary information about the returned page and sends those summary properties
//to the client as a JSON-encoded object.
func SummaryHandler(w http.ResponseWriter, r *http.Request) {
	//Add the following header to the response
	//   Access-Control-Allow-Origin: *
	//this will allow JavaScript served from other origins
	//to call this API
	w.Header().Add("Access-Control-Allow-Origin", "*")

	//get the `url` query string parameter
	//if you use r.FormValue() it will also handle cases where
	//the client did POST with `url` as a form field
	//HINT: https://golang.org/pkg/net/http/#Request.FormValue
	url := r.URL.Query().Get("url")

	//if no `url` parameter was provided, respond with
	//an http.StatusBadRequest error and return
	//HINT: https://golang.org/pkg/net/http/#Error
	if len(url) == 0 {
		http.Error(w, "no url was found", http.StatusBadRequest)
	}

	//call getPageSummary() passing the requested URL
	//and holding on to the returned openGraphProps map
	//(see type definition above)
	//if you get back an error, respond to the client
	//with that error and an http.StatusBadRequest code
	if props, err := getPageSummary(url); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	} else {
		//otherwise, respond by writing the openGrahProps
		//map as a JSON-encoded object
		//add the following headers to the response before
		//you write the JSON-encoded object:
		//   Content-Type: application/json; charset=utf-8
		//this tells the client that you are sending it JSON
		w.Header().Add("Content-Type", "application/json; charset=utf-8")

		encoder := json.NewEncoder(w)
		if err := encoder.Encode(props); err != nil {
			http.Error(w,
				"error encoding json: "+err.Error(),
				http.StatusInternalServerError)
		}
	}
}
