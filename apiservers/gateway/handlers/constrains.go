package handlers

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
