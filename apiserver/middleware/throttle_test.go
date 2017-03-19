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

func makeThrottledRequest(t *testing.T, handler http.Handler, authHeader string, state *SessionState) string {
	//create a new response recorder
	resRec := httptest.NewRecorder()
	//create a new request (doesn't matter what the path is)
	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Error(err)
	}

	//add the auth header (if provided)
	if len(authHeader) > 0 {
		req.Header.Add("Authorization", authHeader)
	}

	//call ServeHTTP to process it
	handler.ServeHTTP(resRec, req)

	//ensure the status code was 200
	if resRec.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusOK, resRec.Code)
	}

	//get the Authorization header and ensure it's non-zero length
	respAuthHeader := resRec.Header().Get("Authorization")
	if len(respAuthHeader) == 0 {
		t.Errorf("Authorization header was not included in the response\n")
	}

	//decode the response into a session state
	decoder := json.NewDecoder(resRec.Body)
	if err := decoder.Decode(state); nil != err {
		t.Errorf("error decoding response JSON: %v\n", err)
	}

	return respAuthHeader
}

func TestThrottle(t *testing.T) {
	//create a new sessions manager, using an in-memory session store
	sessionsManager := sessions.NewManager("testsessionkey",
		sessions.NewMemStore(sessions.DefaultSessionDuration))

	echoHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		state := StateFromContext(r.Context())
		encoder := json.NewEncoder(w)
		encoder.Encode(state)
	})

	adaptedHandler := Adapt(echoHandler,
		GetSessionState(sessionsManager),
		Throttle(-1, -1),
	)

	//make a first request
	state := &SessionState{}
	respAuthHeader := makeThrottledRequest(t, adaptedHandler, "", state)

	//ensure that state.Requests is 1
	if 1 != state.Requests {
		t.Errorf("incorrect number of requests in state: expected %d but got %d\n", 1, state.Requests)
	}

	//make another request and ensure state.Requests is 2
	state2 := &SessionState{}
	makeThrottledRequest(t, adaptedHandler, respAuthHeader, state2)
	if state2.Requests != 2 {
		t.Errorf("incorrect number of requests after second request: expected %d but got %d", 2, state2.Requests)
	}
}
