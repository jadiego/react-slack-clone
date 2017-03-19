package sessions

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestManagerGetStateNoCookie(t *testing.T) {
	mgr := NewManager(testSigningKey, NewMemStore(-1))

	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}

	var state string
	resrec := httptest.NewRecorder()

	sid, err := mgr.GetState(resrec, req, state)
	if err != ErrNoSessionID {
		t.Errorf("incorrect error returned from GetState(): expected ErrNoSessionID, got %v\n", err)
	}
	if InvalidSessionID != sid {
		t.Errorf("incorrect session id: expected InvalidSessionID, got %v\n", sid)
	}
}

func TestManagerGetStateInvalidID(t *testing.T) {
	mgr := NewManager(testSigningKey, NewMemStore(-1))
	//create SessionID with different signing key
	//so that it will fail to validate
	sid, err := NewSessionID(testSigningKey + "x")
	if nil != err {
		t.Fatal(err)
	}

	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}
	req.Header.Add(HeaderSessionID, sid.String())

	var state string
	resrec := httptest.NewRecorder()

	sid, err = mgr.GetState(resrec, req, state)
	if err != ErrInvalidID {
		t.Errorf("incorrect error returned from GetState(): expected ErrInvalidID, got %v\n", err)
	}
	if InvalidSessionID != sid {
		t.Errorf("incorrect session id: expected InvalidSessionID, got %v\n", sid)
	}
}

func TestManagerGetStateNoStateFound(t *testing.T) {
	mgr := NewManager(testSigningKey, NewMemStore(-1))
	sid, err := NewSessionID(testSigningKey)
	if nil != err {
		t.Fatal(err)
	}

	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}
	req.Header.Add(HeaderSessionID, sid.String())

	var state string
	resrec := httptest.NewRecorder()

	sid2, err := mgr.GetState(resrec, req, state)
	if err != ErrStateNotFound {
		t.Errorf("incorrect error returned from GetState(): expected ErrStateNotFound, got %v\n", err)
	}
	if sid2 != sid {
		t.Errorf("incorrect session id returned: expected %v, got %v\n", sid, sid2)
	}
}

func TestManagerGetState(t *testing.T) {
	sid, err := NewSessionID(testSigningKey)
	if nil != err {
		t.Fatal(err)
	}

	state := "Hello World"
	store := NewMemStore(-1)
	store.Save(sid, state)
	mgr := NewManager(testSigningKey, store)

	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}
	req.Header.Add(HeaderSessionID, sid.String())

	resrec := httptest.NewRecorder()
	var state2 string

	sid2, err := mgr.GetState(resrec, req, &state2)
	if nil != err {
		t.Fatal(err)
	}
	if sid2 != sid {
		t.Errorf("incorrect session id returned: expected %v, got %v\n", sid, sid2)
	}
	if state2 != state {
		t.Errorf("incorrect state returned: expected %s; got %s\n", state, state2)
	}
}

func TestManagerBegin(t *testing.T) {
	mgr := NewManager(testSigningKey, NewMemStore(-1))
	resrec := httptest.NewRecorder()

	state := "Hello World"
	sid, err := mgr.BeginSession(resrec, &state)
	if nil != err {
		t.Fatal(err)
	}

	req, err := http.NewRequest("GET", "/", nil)
	if nil != err {
		t.Fatal(err)
	}
	req.Header.Add(HeaderSessionID, sid.String())

	resrec = httptest.NewRecorder()
	var state2 string

	sid2, err := mgr.GetState(resrec, req, &state2)
	if nil != err {
		t.Fatal(err)
	}
	if sid2 != sid {
		t.Errorf("incorrect session id returned: expected %v, got %v\n", sid, sid2)
	}
	if state2 != state {
		t.Errorf("incorrect state returned: expected %s; got %s\n", state, state2)
	}
}
