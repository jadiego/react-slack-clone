package middleware

import "net/http"

const (
	//DefaultCORSOrigins are the default allowed origins
	DefaultCORSOrigins = "*"
	//DefaultCORSMethods are the default allowed methods
	DefaultCORSMethods = "GET, PUT, POST, PATCH, DELETE"
	//DefaultCORSAllowHeaders are the default allowed request headers
	DefaultCORSAllowHeaders = "Content-Type, Authorization"
	//DefaultCORSExposeHeaders are the default exposed response headers
	DefaultCORSExposeHeaders = "Authorization"
)

//constants for CORS header names
const (
	headerAccessControlAllowOrigin   = "Access-Control-Allow-Origin"
	headerAccessControlAllowHeaders  = "Access-Control-Allow-Headers"
	headerAccessControlExposeHeaders = "Access-Control-Expose-Headers"
	headerAccessControlAllowMethods  = "Access-Control-Allow-Methods"
)

//CORS is a middleware function that adds the CORS headers to the response
//so that clients from different origins can call our APIs
func CORS(origins, methods, allowHeaders, exposeHeaders string) Adapter {
	//if the origins, methods, allowHeaders, and exposeHeaders
	//parameters are zero-length, default them to their default
	//constant values listed above

	//return an Adapter function that...
	return func(handler http.Handler) http.Handler {
		//returns an http.Handler that...
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//add the following response headers to every request:
			// - Access-Control-Allow-Origin: value of origins param
			// - Access-Control-Allow-Methods: value of methods param
			// - Access-Control-Allow-Headers: value of allowHeaders param
			// - Access-Control-Expose-Headers: value of exposeHeaders param

			//if the request method is OPTIONS, this is a pre-flight
			//CORS request to see if the real request should be allowed
			//so simply respond with no body and http.StatusOK

			//else, call the ServeHTTP() method on `handler`

		})
	}
}
