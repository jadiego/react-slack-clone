package middleware

import (
	"net/http"
)

//Adapter represents an HTTP handler adapter function
type Adapter func(http.Handler) http.Handler

//Adapt will wrap the `handler` with all the `adapters`
func Adapt(handler http.Handler, adapters ...Adapter) http.Handler {
	for i := len(adapters) - 1; i >= 0; i-- {
		handler = adapters[i](handler)
	}
	return handler
}
