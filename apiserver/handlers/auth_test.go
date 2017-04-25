package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"bytes"

	"encoding/json"

	"fmt"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
	"github.com/info344-s17/challenges-jadiego/apiserver/sessions"
)

//our new handlers use handlers.Context struct,
//so we need to create an instance of that struct

var ctx = Context{
	SessionKey:   "key",
	SessionStore: sessions.NewMemStore(-1),
	UserStore:    users.NewMemStore(),
}

func TestUsersPOSTHandler(t *testing.T) {
	handler := http.HandlerFunc(ctx.UsersHandler)

	cases := []users.NewUser{
		users.NewUser{
			Email:        "notanemailaddress",
			UserName:     "",
			FirstName:    "Test",
			LastName:     "Tester",
			Password:     "password",
			PasswordConf: "password",
		},
		users.NewUser{
			Email:        "test@test.com",
			UserName:     "tester",
			FirstName:    "Test",
			LastName:     "Tester",
			Password:     "password",
			PasswordConf: "password",
		},
		//should fail by getbyemail
		users.NewUser{
			Email:        "test@test.com",
			UserName:     "tester2",
			FirstName:    "Test",
			LastName:     "Tester",
			Password:     "password",
			PasswordConf: "password",
		},
		//should fail byusername
		users.NewUser{
			Email:        "test2@test.com",
			UserName:     "tester",
			FirstName:    "Test",
			LastName:     "Tester",
			Password:     "password",
			PasswordConf: "password",
		},
	}
	for i, c := range cases {
		//add body to req
		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(c)
		req, err := http.NewRequest("POST", "/v1/users", b)
		if err != nil {
			t.Fatal(err)
		}
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		//the second case should be the only one thats a valid post and so every
		//case should return a 400 status
		if i != 1 {
			if rr.Code != http.StatusBadRequest {
				t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusOK, rr.Code)
			}
		}
		//Each error when logged returns proper error message
		fmt.Printf("%v, %v", rr.Code, rr.Body)
	}
}

func TestUsersEmptyPOSTHandler(t *testing.T) {
	handler := http.HandlerFunc(ctx.UsersHandler)
	rr := httptest.NewRecorder()
	req, err := http.NewRequest("POST", "/v1/users", nil)

	if err != nil {
		t.Fatal(err)
	}
	handler.ServeHTTP(rr, req)
	//status code should be bad request
	if rr.Code != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusBadRequest, rr.Code)
	}
}

func TestUsersGETHandler(t *testing.T) {
	handler := http.HandlerFunc(ctx.UsersHandler)
	rr := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/v1/users", nil)
	if err != nil {
		t.Fatal(err)
	}
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v\n", rr.Code, http.StatusOK)
	}
	contentType := rr.Header().Get("Content-Type")
	if contentType != contentTypeJSONUTF8 {
		t.Errorf("incorrect Content-Type response header: expected %s; got %s", contentTypeJSONUTF8, contentType)
	}

}

func TestSessionsHandler(t *testing.T) {
	handler := http.HandlerFunc(ctx.SessionsHandler)

	cases := []users.Credentials{
		users.Credentials{
			Email:    "",
			Password: "",
		},
		users.Credentials{
			Email:    "test@test.com",
			Password: "dfagfg",
		},
		users.Credentials{
			Email:    "test@test.com",
			Password: "password",
		},
	}

	for i, c := range cases {
		//add body to req
		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(c)
		req, err := http.NewRequest("POST", "/v1/sessions", b)
		if err != nil {
			t.Fatal(err)
		}
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		//the first two cases should be 401 error messages
		if i != 2 {
			if rr.Code != http.StatusUnauthorized {
				t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusUnauthorized, rr.Code)
			}
		}
		//Each error when logged returns proper error message
		fmt.Printf("%v, %v", rr.Code, rr.Body)
	}
}
