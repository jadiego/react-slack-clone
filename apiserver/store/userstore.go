package store

import "errors"

//ErrUserNotFound is returned when the requested user is not found in the store
var ErrUserNotFound = errors.New("user not found")

//UserStore represents an abstract store for model.User objects.
//This interface is used by the HTTP handlers to insert new users,
//get users, and update users. This interface can be implemented
//for any persistent database you want (e.g., MongoDB, PostgreSQL, etc.)
type UserStore interface {
	//uncomment the following interface function definitions
	//these are commented out because your import path for the
	//models package will depend on your GitHub username

	//GetAll returns all users
	//GetAll() ([]*models.User, error)

	//GetByID returns the User with the given ID
	//GetByID(id string) (*models.User, error)

	//GetByEmail returns the User with the given email
	//GetByEmail(email string) (*models.User, error)

	//GetByUserName returns the User with the given user name
	//GetByUserName(name string) (*models.User, error)

	//Insert inserts a new NewUser into the store
	//and returns a User with a newly-assigned ID
	//Insert(newUser *models.NewUser) (*models.User, error)

	//Update applies UserUpdates to the currentUser
	//Update(updates *models.UserUpdates, currentuser *models.User) error
}
