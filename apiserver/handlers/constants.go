package handlers

const (
	headerContentType = "Content-Type"
)

const (
	charsetUTF8         = "charset=utf-8"
	contentTypeText     = "text/plain"
	contentTypeJSON     = "application/json"
	contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
	contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
)

const headerLink = "Link"
