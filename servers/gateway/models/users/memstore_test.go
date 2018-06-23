package users

import "testing"

func TestMemStore(t *testing.T) {
	store := NewMemStore()
	nu := &NewUser{
		Email:        "test@test.com",
		UserName:     "tester",
		FirstName:    "Test",
		LastName:     "Tester",
		Password:     "password",
		PasswordConf: "password",
	}

	u, err := store.Insert(nu)
	if err != nil {
		t.Errorf("error inserting user: %v\n", err)
	}
	if nil == u {
		t.Fatalf("nil returned from MemStore.Insert()--you probably haven't implemented NewUser.ToUser() yet")
	}

	if len(string(u.ID)) == 0 {
		t.Errorf("new ID is zero-length\n")
	}

	u2, err := store.GetByID(u.ID)
	if err != nil {
		t.Errorf("error getting new user by ID: %v\n", err)
	}
	if u2.ID != u.ID {
		t.Errorf("ID of user fetched by id didn't match: expected %s but got %s\n", u.ID, u2.ID)
	}

	u2, err = store.GetByEmail(nu.Email)
	if err != nil {
		t.Errorf("error getting new user by email: %v\n", err)
	}
	if u2.ID != u.ID {
		t.Errorf("ID of user fetched by email didn't match: expected %s but got %s\n", u.ID, u2.ID)
	}

	u2, err = store.GetByUserName(nu.UserName)
	if err != nil {
		t.Errorf("error getting new user by user name: %v\n", err)
	}
	if u2.ID != u.ID {
		t.Errorf("ID of user fetched by name didn't match: expected %s but got %s\n", u.ID, u2.ID)
	}

	all, err := store.GetAll()
	if err != nil {
		t.Errorf("error getting all users: %v\n", err)
	}
	if len(all) != 1 {
		t.Errorf("incorrect length of all users: expected %d but got %d\n", 1, len(all))
	}
	if all[0].ID != u.ID {
		t.Errorf("ID of user fetched by all didn't match: expected %s but got %s\n", u.ID, u2.ID)
	}

	upd := &UserUpdates{
		FirstName: "UPDATED Test",
		LastName:  "UPDATED Tester",
	}
	if err := store.Update(upd, u); err != nil {
		t.Errorf("error updating user: %v\n", err)
	}
	if u.FirstName != "UPDATED Test" {
		t.Errorf("FirstName field not updated: expected `UPDATED Test` but got `%s`\n", u.FirstName)
	}
	if u.LastName != "UPDATED Tester" {
		t.Errorf("FirstName field not updated: expected `UPDATED Tester` but got `%s`\n", u.LastName)
	}
}
