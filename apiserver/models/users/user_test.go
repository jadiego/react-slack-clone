package users

import "testing"
import "encoding/json"
import "strings"

func createNewUser() *NewUser {
	return &NewUser{
		Email:        "test@test.com",
		Password:     "password",
		PasswordConf: "password",
		UserName:     "mrtester",
		FirstName:    "test",
		LastName:     "tester",
	}
}

func TestNewUserValidate(t *testing.T) {
	nu := createNewUser()

	nu.Email = "invalid"
	if err := nu.Validate(); nil == err {
		t.Errorf("should have gotten an error about invalid email\n")
	}

	nu.Email = "valid@example.com"
	if err := nu.Validate(); nil != err {
		t.Errorf("shouldn't have gotten an error about valid email\n")
	}

	nu.UserName = ""
	if err := nu.Validate(); nil == err {
		t.Errorf("should have gotten an error about missing user name\n")
	}

	nu.Password = "short"
	nu.PasswordConf = "short"
	if err := nu.Validate(); nil == err {
		t.Errorf("should have gotten an error about password being too short\n")
	}

	nu.Password = "password"
	nu.PasswordConf = "nomatch"
	if err := nu.Validate(); nil == err {
		t.Errorf("should have gotten an error about password conf not matching\n")
	}
}

func TestNewUserToUser(t *testing.T) {
	nu := createNewUser()
	u, err := nu.ToUser()
	if err != nil {
		t.Errorf("error converting NewUser to User: %s\n", err.Error())
	}
	if nil == u {
		t.Fatalf("ToUser() returned nil\n")
	}
	if nu.Email != u.Email {
		t.Errorf("User.Email !+ NewUser.Email: expected %s but got %s\n", nu.Email, u.Email)
	}
	if len(u.PassHash) == 0 {
		t.Errorf("User.PassHash is zero length, should be hashed password\n")
	}
	if len(u.PhotoURL) == 0 || !strings.HasPrefix(u.PhotoURL, gravatarBasePhotoURL) {
		t.Errorf("User.PhotoURL is zero length, should be gravatar profile image URL\n")
	}
}

func TestSetPassword(t *testing.T) {
	u := &User{}
	if err := u.SetPassword("password"); err != nil {
		t.Errorf("error setting password: %s\n", err.Error())
	}
	if len(u.PassHash) == 0 {
		t.Errorf("User.PassHash is zero length, should be hashed password\n")
	}
	if string(u.PassHash) == "password" {
		t.Errorf("plaintext password was stored in PassHash instead of hashed password\n")
	}
}

func TestAuthenticate(t *testing.T) {
	u := &User{}
	if err := u.SetPassword("password"); err != nil {
		t.Errorf("error setting password: %s\n", err.Error())
	}
	if err := u.Authenticate("password"); err != nil {
		t.Errorf("error authenticating valid password: %s\n", err.Error())
	}
	if err := u.Authenticate("incorrect"); err == nil {
		t.Errorf("no error authenticating incorrect password\n")
	}
}

func TestNoPassHashInJSON(t *testing.T) {
	u := &User{}
	if err := u.SetPassword("password"); err != nil {
		t.Errorf("error setting password: %s\n", err.Error())
	}
	j, err := json.Marshal(u)
	if err != nil {
		t.Errorf("error encoding User into JSON: %s\n", err.Error())
	}
	sj := string(j)
	if strings.Contains(sj, "passHash") || strings.Contains(sj, "PassHash") {
		t.Errorf("PassHash field was encoded into JSON; should not be present in encoded JSON\n")
	}
}
