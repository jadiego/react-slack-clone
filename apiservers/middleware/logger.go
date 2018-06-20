package middleware

import (
	"log"
	"net/http"
	"time"
)

// LoggedResponseWriter is similar to http.ResponseWriter but
// with the status code recorded
type LoggedResponseWriter struct {
	http.ResponseWriter
	status int
}

// WriteHeader method of LoggedResponseWriter
func (w *LoggedResponseWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

// Write method of LoggedResponseWriter
func (w *LoggedResponseWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = 200
	}

	return w.ResponseWriter.Write(b)
}

// Header method of LoggedResponseWriter
func (w *LoggedResponseWriter) Header() http.Header {
	return w.ResponseWriter.Header()
}

// Notify log all requests and response status codes
func Notify(logger *log.Logger) Adapter {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			sw := LoggedResponseWriter{ResponseWriter: w}

			handler.ServeHTTP(&sw, r)

			duration := time.Now().Sub(start)

			logger.Printf(" %v | %d |\t%s | %s | %s %s\n", start.Format(time.UnixDate), sw.status,
				duration, r.Host, r.Method, r.URL.String())
		})
	}
}
