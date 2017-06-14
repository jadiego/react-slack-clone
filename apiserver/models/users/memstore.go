package users

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

//MemStore is an implementation of UserStore
//backed by an in-memory slice. This should only
//be used for automated testing. This is not
//safe for concurrent access
type MemStore struct {
	entries []*User
}

//NewMemStore returns a new MemStore
func NewMemStore() *MemStore {
	return &MemStore{
		entries: []*User{},
	}
}

//GetAll returns all users
func (mus *MemStore) GetAll() ([]*User, error) {
	users := make([]*User, len(mus.entries))
	copy(users, mus.entries)
	return users, nil
}

//GetByID returns the User with the given ID
func (mus *MemStore) GetByID(id UserID) (*User, error) {
	for _, u := range mus.entries {
		if u.ID == id {
			return u, nil
		}
	}
	return nil, ErrUserNotFound
}

//GetByEmail returns the User with the given email
func (mus *MemStore) GetByEmail(email string) (*User, error) {
	for _, u := range mus.entries {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, ErrUserNotFound
}

//GetByUserName returns the User with the given user name
func (mus *MemStore) GetByUserName(name string) (*User, error) {
	for _, u := range mus.entries {
		if u.UserName == name {
			return u, nil
		}
	}
	return nil, ErrUserNotFound
}

//Insert inserts a new NewUser into the database
//and return a User with new ID, or an error
func (mus *MemStore) Insert(newUser *NewUser) (*User, error) {
	u, err := newUser.ToUser()
	if err != nil {
		return nil, err
	}
	if nil == u {
		return nil, fmt.Errorf(".ToUser() returned nil")
	}

	id, err := mus.newID()
	if err != nil {
		return nil, err
	}
	u.ID = id
	mus.entries = append(mus.entries, u)
	return u, nil
}

//Update applies UserUpdates to the currentUser
func (mus *MemStore) Update(updates *UserUpdates, currentuser *User) error {
	u, err := mus.GetByID(currentuser.ID)
	if err != nil {
		return err
	}
	u.FirstName = updates.FirstName
	u.LastName = updates.LastName
	return nil
}

func (mus *MemStore) newID() (UserID, error) {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); nil != err {
		return "", err
	}
	return UserID(hex.EncodeToString(buf)), nil
}
