package middleware

import (
	"log"
	"net/http"
	"time"
)

//Notify log all requests and response status codes
func Notify(logger *log.Logger) Adapter {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			logger.Printf("TimeStart:%v, Method:%s, Path:%s, Addr:%s, ",
				start, r.Method, r.URL.Path, r.RemoteAddr)
			handler.ServeHTTP(w, r)
			logger.Printf("TimeEnd:%v\n", time.Since(start))
		})
	}
}
