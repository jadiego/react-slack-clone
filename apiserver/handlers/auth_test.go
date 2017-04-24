package handlers

import "testing"
import "net/http"
import "net/http/httptest"
import "github.com/info344-s17/challenges-jadiego/apiserver/sessions"
import "github.com/info344-s17/challenges-jadiego/apiserver/models/users"

func testUsersHandler(t *testing.T) {
	//our new handlers use handlers.Context struct,
	//so we need to create an instance of that struct
	ctx := Context{
		SessionKey:   "key",
		SessionStore: sessions.NewMemStore(-1),
		UserStore:    users.NewMemStore(),
	}

	// Create a request to pass to our handler. We don't have any query parameters for now, so we'll
	// pass 'nil' as the third parameter.
	req, err := http.NewRequest("GET", "/v1/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(ctx.UsersHandler)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}
