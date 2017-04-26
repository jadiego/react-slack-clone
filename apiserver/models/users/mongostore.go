package users

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//MongoStore represents a users.Store backed by MongoDB.
type MongoStore struct {
	Session        *mgo.Session
	DatabaseName   string
	CollectionName string
}

//GetAll returns all users
func (ms *MongoStore) GetAll() ([]*User, error) {
	users := []*User{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.CollectionName).Find(nil).All(&users)
	if err != nil {
		return nil, err
	}
	return users, nil
}

//GetByID returns the User with the given ID
func (ms *MongoStore) GetByID(id UserID) (*User, error) {
	user := &User{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.CollectionName).FindId(id).One(user)
	if err == mgo.ErrNotFound {
		return nil, ErrUserNotFound
	}
	return user, err
}

//GetByEmail returns the User with the given email
func (ms *MongoStore) GetByEmail(email string) (*User, error) {
	user := &User{}
	query := bson.M{"email": email}
	err := ms.Session.DB(ms.DatabaseName).C(ms.CollectionName).Find(query).One(user)
	//if the user was not found, Mongo will return a mgo.ErrNotFound,
	//so we return a users.ErrUserNotFound
	if err == mgo.ErrNotFound {
		return nil, ErrUserNotFound
	}
	return user, err
}

//GetByUserName returns the User with the given user name
func (ms *MongoStore) GetByUserName(name string) (*User, error) {
	user := &User{}
	query := bson.M{"username": name}
	err := ms.Session.DB(ms.DatabaseName).C(ms.CollectionName).Find(query).One(user)
	if err == mgo.ErrNotFound {
		return nil, ErrUserNotFound
	}
	return user, err
}

//Insert inserts a new NewUser into the store
//and returns a User with a newly-assigned ID
func (ms *MongoStore) Insert(newUser *NewUser) (*User, error) {
	u, err := newUser.ToUser()
	if err != nil {
		return nil, err
	}

	u.ID = UserID(bson.NewObjectId().Hex())
	err = ms.Session.DB(ms.DatabaseName).C(ms.CollectionName).Insert(u)
	return u, err
}

//Update applies UserUpdates to the currentUser
func (ms *MongoStore) Update(updates *UserUpdates, currentuser *User) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.CollectionName)
	userupdates := bson.M{"$set": updates}
	err := col.UpdateId(currentuser.ID, userupdates)
	return err
}

//NewMongoStore constructs a new MongoStore, using the provided
//addr. If the `mongoAddr` is nil, it will use a default port and host
func NewMongoStore(mongoAddr, DBName, CollectName string) (*MongoStore, error) {
	if len(mongoAddr) == 0 {
		mongoAddr = "127.0.0.1:27017"
	}

	sess, err := mgo.Dial(mongoAddr)
	if err != nil {
		return nil, err
	}

	if len(DBName) == 0 {
		DBName = "chat"
	}

	if len(CollectName) == 0 {
		CollectName = "users"
	}

	defer sess.Close()
	return &MongoStore{
		Session:        sess,
		DatabaseName:   DBName,
		CollectionName: CollectName,
	}, nil
}
