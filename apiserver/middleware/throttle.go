package middleware

import (
	"net/http"
	"time"
)

const (
	//DefaultRequestLimit is the default used for requests limits
	DefaultRequestLimit = 300
	//DefaultRequestLimitDuration is the default used for the limit duration
	DefaultRequestLimitDuration = time.Minute
)

//Throttle returns a middleware adapter that ensures clients
//don't make too many requests to our server. If `limit` is <= 0,
//DefaultRequestLimit will be used. If `limitDuration` is <= 0,
//DefaultRequestLimitDuration will be used.
func Throttle(limit int, limitDuration time.Duration) Adapter {
	//default the limit and limitDuration parameters

	//return an Adapter function...
	return func(handler http.Handler) http.Handler {
		//that returns an http.Handler that...
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//get the SessionState from the request context

			//if ResetAt.isZero()
			//initialize the Limit to the `limit` parameters
			//and ResetAt to the current time plus the limitDuration

			//else if the current time is > ResetAt
			//reset Requests to zero
			//and ResetAt to the current time plus the limitDuration

			//increment the Requests field

			//if Requests >= Limit
			//respond with an http.StatusTooManyRequests error

			//else call the handler's .ServeHTTP() method

		})
	}
}
