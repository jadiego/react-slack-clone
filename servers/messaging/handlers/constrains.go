package handlers

import "errors"

// ErrInvalidUserHeader is returned when the given user JSON string
// passed in the X-User header is an invalid JSON string
var ErrInvalidUserHeader = errors.New("invalid user header passed")

const (
	headerContentType = "Content-Type"
	headerXUser       = "X-User"
)

const (
	charsetUTF8         = "charset=utf-8"
	contentTypeText     = "text/plain"
	contentTypeJSON     = "application/json"
	contentTypeTextHTML = "text/html"
	contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
	contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
)

const headerLink = "Link"
