package middleware

type contextKey int

const (
	//SessionStateContextKey is used to store and retrieve the SessionState
	//on the Request context
	SessionStateContextKey contextKey = iota
)
