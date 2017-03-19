package middleware

//NOTE: change the import path for the sessions package
//to match your particular path to that package
//instead of `info344-s17/challenges/apiserver/sessions` it should be
//
// `github.com/info344-s17/challenges-[your-github-name]/apiserver/sessions`
//
//where `[your-github-name]` is replaced with your github user name
import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/info344-s17/challenges/apiserver/sessions"
)

func TestGetSessionState(t *testing.T) {
	//create a new sessions manager, using an in-memory session store
	sessionsManager := sessions.NewManager("testsessionkey",
		sessions.NewMemStore(sessions.DefaultSessionDuration))

	//call GetSessionState(), passing the sessions manager to create
	//an adapater middleware function
	adapt := GetSessionState(sessionsManager)
	//use that middleware function to adapt a simple handler that
	//just gets the sessions state and writes it to the client as JSON
	handler := adapt(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		state := StateFromContext(r.Context())
		encoder := json.NewEncoder(w)
		encoder.Encode(state)
	}))

	//create a new response recorder
	resRec := httptest.NewRecorder()
	//create a new request (doesn't matter what the path is)
	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}
	//call ServeHTTP to process it
	handler.ServeHTTP(resRec, req)

	//ensure the status code was 200
	if resRec.Code != http.StatusOK {
		t.Fatalf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusOK, resRec.Code)
	}

	//ensure that the Authorization response header was included
	authHeader := resRec.Header().Get("Authorization")
	if 0 == len(authHeader) {
		t.Fatalf("Authorization header not included in response headers\n")
	}

	//decode the response JSON and ensure that it
	//contains the expected keys
	actual := map[string]interface{}{}
	decoder := json.NewDecoder(resRec.Body)
	decoder.Decode(&actual)

	expectedKeys := []string{"limit", "requests", "resetAt"}
	for _, key := range expectedKeys {
		if _, ok := actual[key]; !ok {
			t.Fatalf("expected key `%s` was not in returned map\n", key)
		}
	}
}
