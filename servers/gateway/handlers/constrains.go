package handlers

const (
	headerContentType = "Content-Type"
	headerXUser       = "X-User"
)

const (
	charsetUTF8         = "charset=utf-8"
	contentTypeText     = "text/plain"
	contentTypeJSON     = "application/json"
	contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
	contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
)
