package users

import "errors"

//ErrUserNotFound is returned when the requested user is not found in the store
var ErrUserNotFound = errors.New("user not found")

//Store represents an abstract store for model.User objects.
//This interface is used by the HTTP handlers to insert new users,
//get users, and update users. This interface can be implemented
//for any persistent database you want (e.g., MongoDB, PostgreSQL, etc.)
type Store interface {
	//GetAll returns all users
	GetAll() ([]*User, error)

	//GetByID returns the User with the given ID
	GetByID(id UserID) (*User, error)

	//GetByEmail returns the User with the given email
	GetByEmail(email string) (*User, error)

	//GetByUserName returns the User with the given user name
	GetByUserName(name string) (*User, error)

	//Insert inserts a new NewUser into the store
	//and returns a User with a newly-assigned ID
	Insert(newUser *NewUser) (*User, error)

	//Update applies UserUpdates to the currentUser
	Update(updates *UserUpdates, currentuser *User) error
}
