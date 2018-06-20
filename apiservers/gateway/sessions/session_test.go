package sessions

import "testing"
import "net/http/httptest"
import "strings"
import "net/http"

func TestSessionCycle(t *testing.T) {
	state := struct {
		Message string
	}{
		Message: "testing",
	}
	key := "key"
	store := NewMemStore(-1)
	respRec := httptest.NewRecorder()
	sid, err := BeginSession(key, store, &state, respRec)
	if err != nil {
		t.Errorf("error beginning session: %s\n", err.Error())
	}

	state2 := struct {
		Message string
	}{
		Message: "",
	}
	store.Get(sid, &state2)
	if state.Message != state2.Message {
		t.Errorf("state was not saved to store: expected message to be %s, but got %s\n", state.Message, state2.Message)
	}

	auth := respRec.Header().Get(headerAuthorization)
	if !strings.HasPrefix(auth, schemeBearer) {
		t.Errorf("Authorization header value does not start with %s: got %s\n", schemeBearer, auth)
	}

	state2.Message = ""
	req, _ := http.NewRequest("GET", "/", nil)
	req.Header.Add(headerAuthorization, schemeBearer+sid.String())
	sid2, err := GetState(req, key, store, &state2)
	if err != nil {
		t.Errorf("error getting state: %s\n", err.Error())
	}
	if state2.Message != state.Message {
		t.Errorf("GetState did not retrieve expected state: expected message to be %s, but got %s\n", state.Message, state2.Message)
	}
	if sid.String() != sid2.String() {
		t.Errorf("GetState returned incorrect SessionID: expected %s but got %s\n", sid.String(), sid2.String())
	}

	_, err = EndSession(req, key, store)
	if err != nil {
		t.Errorf("error ending session: %s\n", err.Error())
	}
	if err := store.Get(sid, &state2); err == nil {
		t.Error("was able to get state from store after EndSession\n")
	}
}

func TestGetSessionID(t *testing.T) {
	key := "key"
	sid, err := NewSessionID(key)
	if err != nil {
		t.Errorf("error generating new SessionID: %s\n", err.Error())
	}
	req, _ := http.NewRequest("GET", "/", nil)
	_, err = GetSessionID(req, key)
	if nil == err {
		t.Errorf("no error when Authorization header is missing\n")
	}

	req.Header.Add(headerAuthorization, "Basic "+sid.String())
	_, err = GetSessionID(req, key)
	if nil == err {
		t.Errorf("no error when Authorization scheme is invalid\n")
	}

	req.Header.Set(headerAuthorization, schemeBearer+sid.String())

	sid2, err := GetSessionID(req, key)
	if err != nil {
		t.Errorf("error getting session id from request: %s\n", err.Error())
	}
	if sid2.String() != sid.String() {
		t.Errorf("session IDs were different: expected %s but got %s\n", sid.String(), sid2.String())
	}
}
