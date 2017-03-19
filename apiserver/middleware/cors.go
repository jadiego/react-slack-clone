package middleware

//CORS is a middleware function that adds the CORS headers to the response
//so that clients from different origins can call our APIs
func CORS() Adapter {
	//return an Adapter function...

	//that returns an HTTP handler...

	//that does the following:
	// - adds the following response headers to every request:
	//    - Access-Control-Allow-Origin: *
	//    - Access-Control-Allow-Headers: Content-Type, Authorization
	//    - Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE
	//    - Access-Control-Expose-Headers: Authorization
	// - if the request method is OPTIONS (pre-flight CORS request),
	//   simply responds with http.StatusOK
	//   else, calls the handler's ServeHTTP() method

	return nil
}
