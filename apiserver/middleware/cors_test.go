package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS(t *testing.T) {
	//variable to track whether handler was called
	handlerCalled := false

	//create a handler that simply sets handlerCalled to true
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	//adapt handler with CORS()
	adaptedHandler := Adapt(handler, CORS("", "", "", ""))

	//define a new OPTIONS request (shouldn't call handler)
	req, _ := http.NewRequest("OPTIONS", "/", nil)

	//define a response recorder
	respRec := httptest.NewRecorder()

	//invoke the adapted handler
	adaptedHandler.ServeHTTP(respRec, req)

	//ensure handler wasn't called
	if handlerCalled {
		t.Errorf("handler called during OPTIONS request\n")
	}

	//ensure response code was OK
	if respRec.Code != http.StatusOK {
		t.Errorf("incorrect response status code: expected 200 but got %d", respRec.Code)
	}

	//ensure expected headers are present
	expectedHeaders := map[string]string{
		headerAccessControlAllowOrigin:   DefaultCORSOrigins,
		headerAccessControlAllowHeaders:  DefaultCORSAllowHeaders,
		headerAccessControlAllowMethods:  DefaultCORSMethods,
		headerAccessControlExposeHeaders: DefaultCORSExposeHeaders,
	}

	for k, v := range expectedHeaders {
		actual := respRec.Header().Get(k)
		if v != actual {
			t.Errorf("incorrect value for CORS header %s: expected `%s`, but got `%s`\n", k, v, actual)
		}
	}

	//now call again with a GET request and ensure the handler is called
	req, _ = http.NewRequest("GET", "/", nil)
	respRec = httptest.NewRecorder()
	adaptedHandler.ServeHTTP(respRec, req)
	if !handlerCalled {
		t.Errorf("handler was not called for GET request\n")
	}

}
