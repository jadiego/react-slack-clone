package users

import (
	"os"
	"testing"

	"github.com/globalsign/mgo"
)

// NOTE: tests in this file will use the MONGOADDR
// environment variable for the mongodb server address.
// If not defined, it will default to a local instance of mongoDB.
// To start a local redis server using Docker, run
// this command:
// docker container run -d -p 27017:27017 --name testmongo mongo

func TestMongoStore(t *testing.T) {
	mongoAddr := os.Getenv("MONGOADDR")
	if len(mongoAddr) == 0 {
		mongoAddr = "localhost"
	}

	sess, err := mgo.Dial(mongoAddr)
	if err != nil {
		t.Fatalf("error dialing Mongo: %v", err)
	}
	defer sess.Close()

	store := &MongoStore{
		Session:        sess,
		DatabaseName:   "test",
		CollectionName: "users",
	}

	newuser := &NewUser{
		Email:        "test@test.com",
		Password:     "password",
		PasswordConf: "password",
		UserName:     "tester",
		FirstName:    "Test",
		LastName:     "Tester",
	}

	user, err := store.Insert(newuser)
	if err != nil {
		t.Errorf("error inserting new user(%v): %v", user, err)
	}

	user2, err := store.GetByEmail(user.Email)
	if err != nil {
		t.Errorf("error fetching user by email: %v", err)
	}
	if user2.Email != user.Email {
		t.Errorf("user email didn't match for GetByEmail(), expected %s but got %s", user.Email, user2.Email)
	}

	user3, err := store.GetByUserName(user.UserName)
	if err != nil {
		t.Errorf("error fetching user by name: %v", err)
	}
	if user3.UserName != user.UserName {
		t.Errorf("user username didn't match for GetByUserName(), expected %s but got %s", user.UserName, user3.UserName)
	}

	user4, err := store.GetByID(user.ID)
	if err != nil {
		t.Errorf("error fetching user by ID: %v", err)
	}
	if user4.ID != user.ID {
		t.Errorf("ID didn't match, expected %s but got %s", user.ID, user4.ID)
	}

	updates := &UserUpdates{
		FirstName: "Test 2.0",
		LastName:  "Tester 2.0",
	}

	if err := store.Update(updates, user); err != nil {
		t.Errorf("error updating user, %v", err)
	}

}
