package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jadiego/react-slack-clone/apiservers/gateway/models/users"
	"github.com/jadiego/react-slack-clone/apiservers/gateway/sessions"
)

//Each test functions are meant to be run separtely

type userTestCase struct {
	user                interface{}
	expectedCode        int
	expectedContentType string
}

//our new handlers use handlers.Context struct,
//so we need to create an instance of that struct

var ctx = Context{
	SessionKey:   "key",
	SessionStore: sessions.NewMemStore(-1),
	UserStore:    users.NewMemStore(),
}

func TestUsersPOSTHandler(t *testing.T) {
	handler := http.HandlerFunc(ctx.UsersHandler)

	cases := []userTestCase{
		{
			users.NewUser{
				Email:        "notanemailaddress",
				UserName:     "",
				FirstName:    "Test",
				LastName:     "Tester",
				Password:     "password",
				PasswordConf: "password",
			},
			400,
			contentTypeTextUTF8,
		},
		{
			users.NewUser{
				Email:        "test@test.com",
				UserName:     "tester",
				FirstName:    "Test",
				LastName:     "Tester",
				Password:     "password",
				PasswordConf: "password",
			},
			200,
			contentTypeJSONUTF8},
		//should fail by getbyemail
		{
			users.NewUser{
				Email:        "test@test.com",
				UserName:     "tester2",
				FirstName:    "Test",
				LastName:     "Tester",
				Password:     "password",
				PasswordConf: "password",
			},
			400,
			contentTypeTextUTF8,
		},
		//should fail byusername
		{
			users.NewUser{
				Email:        "test2@test.com",
				UserName:     "tester",
				FirstName:    "Test",
				LastName:     "Tester",
				Password:     "password",
				PasswordConf: "password",
			},
			400,
			contentTypeTextUTF8,
		},
	}
	for i, c := range cases {
		//add body to req
		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(c.user)
		req, err := http.NewRequest("POST", "/v1/users", b)
		if err != nil {
			t.Fatal(err)
		}
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		if rr.Code != c.expectedCode {
			t.Errorf("handler returned wrong status code for cases[%v] in slice of cases: expected `%d` but got `%d`\n", i, http.StatusOK, rr.Code)
		}

		if rr.Header().Get(headerContentType) != c.expectedContentType {
			t.Errorf("handler returned wrong content type for cases[%v] in slice of cases: expected `%v` but got `%v`\n", i, c.expectedContentType, rr.Header().Get(headerContentType))
		}
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

	cases := []struct {
		credentials         users.Credentials
		expectedCode        int
		expectedContentType string
	}{
		{
			users.Credentials{
				Email:    "",
				Password: "",
			},
			401,
			contentTypeTextUTF8,
		},
		{
			users.Credentials{
				Email:    "test@test.com",
				Password: "dfagfg",
			},
			401,
			contentTypeTextUTF8,
		},
		{
			users.Credentials{
				Email:    "test@test.com",
				Password: "password",
			},
			200,
			contentTypeJSONUTF8,
		},
	}

	//If testing by itself uncomment these
	// nu := &users.NewUser{
	// 	Email:        "test@test.com",
	// 	UserName:     "tester",
	// 	FirstName:    "Test",
	// 	LastName:     "Tester",
	// 	Password:     "password",
	// 	PasswordConf: "password",
	// }

	// u1, _ := ctx.UserStore.Insert(nu)

	for i, c := range cases {
		//add body to req
		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(c.credentials)
		req, err := http.NewRequest("POST", "/v1/sessions", b)
		if err != nil {
			t.Fatal(err)
		}
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		if rr.Code != c.expectedCode {
			t.Errorf("handler returned wrong status code for cases[%v]: expected `%d` but got `%d`\n", i, c.expectedCode, rr.Code)
		}
		if rr.Header().Get(headerContentType) != c.expectedContentType {
			t.Errorf("handler returned wrong content type for cases[%v]: expected `%v` but got `%v`\n", i, c.expectedContentType, rr.Header().Get(headerContentType))
		}
	}

}
