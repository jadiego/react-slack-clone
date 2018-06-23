package messages

import (
	"errors"
	"fmt"
	"time"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/jadiego/react-slack-clone/servers/gateway/models/users"
)

const (
	// DefaultDBName is the default MongoDB database name
	DefaultDBName = "chat"
	// DefaultChanColName is the default MongoDB collections name for channel objects
	DefaultChanColName = "channels"
	// DefaultMsgColName is the default MongoDB collections name for message objects
	DefaultMsgColName = "messages"
)

// MongoStore represents a stories.Store backed by MongoDB
type MongoStore struct {
	Session      *mgo.Session
	DatabaseName string
	ChanColName  string
	MsgColName   string
}

// GetMyChannels get all channels a given user is allowed to see (i.e.,
// channels the user is a member of, as well as all public channels, if is creator)
func (ms *MongoStore) GetMyChannels(id users.UserID) ([]*Channel, error) {
	channels := []*Channel{}
	idquery := bson.M{"members": id}
	privatequery := bson.M{"private": false}
	query := bson.M{"$or": []bson.M{idquery, privatequery}}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Find(query).All(&channels)
	return channels, err
}

// GetChannelByID gets a single channel by the given id parameter
func (ms *MongoStore) GetChannelByID(id ChannelID) (*Channel, error) {
	channel := &Channel{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).FindId(id).One(channel)
	if err == mgo.ErrNotFound {
		return nil, ErrChannelNotFound
	}
	return channel, err
}

// InsertChannel inserts a new channel into the store
func (ms *MongoStore) InsertChannel(id users.UserID, newchannel *NewChannel) (*Channel, error) {
	channel := &Channel{}
	query := bson.M{"name": newchannel.Name}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Find(query).One(channel)
	if err != nil && err != mgo.ErrNotFound {
		return nil, err
	}

	if channel.Name == newchannel.Name {
		return nil, errors.New("channel already exists")
	}

	c, err := newchannel.ToChannel()
	if err != nil {
		return nil, err
	}

	// attach creator's id in new channel
	c.CreatorID = id
	// create id of channel
	c.ID = ChannelID(bson.NewObjectId().Hex())

	err = ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Insert(c)
	return c, err
}

// InsertDMChannel inserts a new DM channel into the store
func (ms *MongoStore) InsertDMChannel(id users.UserID, newchannel *NewDMChannel) (*Channel, error) {
	// make sure channel is of type DM and has only 1 user recipient
	err := newchannel.Validate()
	if err != nil {
		return nil, err
	}

	channel := &Channel{}
	query := bson.M{"type": 1, "creator_id": id, "members": newchannel.Members}
	err = ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Find(query).One(channel)
	if err != nil && err != mgo.ErrNotFound {
		return nil, err
	}

	// found the channel
	if err == nil {
		return nil, errors.New("channel already exists")
	}

	c, err := newchannel.ToChannel()
	if err != nil {
		return nil, err
	}

	// attach creator's id in new channel
	c.CreatorID = id
	// create id of channel
	c.ID = ChannelID(bson.NewObjectId().Hex())

	err = ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Insert(c)
	return c, err
}

// GetChannelMessages gets the most recent N messages posted to
// a particular channel
func (ms *MongoStore) GetChannelMessages(id ChannelID, n int) ([]*Message, error) {
	messages := []*Message{}
	query := bson.M{"channel_id": id}
	err := ms.Session.DB(ms.DatabaseName).C(ms.MsgColName).Find(query).Sort("createdAt").Limit(n).All(&messages)
	return messages, err
}

// UpdateChannel updates a channels name and description
func (ms *MongoStore) UpdateChannel(updates *ChannelUpdates, currentchannel *Channel) (*Channel, error) {
	channel := &Channel{}
	query := bson.M{"name": currentchannel.Name}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).Find(query).One(channel)
	if err != nil && err != mgo.ErrNotFound {
		return nil, err
	}

	col := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName)
	channelupdates := bson.M{"$set": updates}
	err = col.UpdateId(currentchannel.ID, channelupdates)
	if err != nil {
		return nil, err
	}
	updatedchannel := currentchannel
	updatedchannel.Name = updates.Name
	updatedchannel.Description = updates.Description

	return updatedchannel, nil
}

// DeleteChannel delete a channel, as well as all messages posted to that channel
func (ms *MongoStore) DeleteChannel(id ChannelID) error {
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).RemoveId(id)
	if err != nil {
		return err
	}

	_, err = ms.Session.DB(ms.DatabaseName).C(ms.MsgColName).RemoveAll(bson.M{"channel_id": id})
	if err != nil {
		return err
	}
	return nil
}

// AddChannelMember add a user to a channel's Members list
func (ms *MongoStore) AddChannelMember(id users.UserID, currentchannel *Channel) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName)
	memberupdates := bson.M{"$addToSet": bson.M{"members": id}}
	err := col.UpdateId(currentchannel.ID, memberupdates)
	return err
}

// RemoveChannelmember remove a user from a channel's Members list
func (ms *MongoStore) RemoveChannelmember(id users.UserID, currentchannel *Channel) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName)
	memberupdates := bson.M{"$pull": bson.M{"members": id}}
	err := col.UpdateId(currentchannel.ID, memberupdates)
	return err
}

// GetMessageByID gets a single message by the given id parameter
func (ms *MongoStore) GetMessageByID(id MessageID) (*Message, error) {
	message := &Message{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.MsgColName).FindId(id).One(message)
	if err == mgo.ErrNotFound {
		return nil, ErrMessageNotFound
	}
	return message, err
}

// InsertMessage inserts a new message and returns a new Message
// with a newly assigned ID
func (ms *MongoStore) InsertMessage(id users.UserID, newmessage *NewMessage) (*Message, error) {
	channel := &Channel{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChanColName).FindId(newmessage.ChannelID).One(channel)
	if err == mgo.ErrNotFound {
		return nil, ErrChannelNotFound
	}

	m, err := newmessage.ToMessage()
	if err != nil {
		return nil, err
	}

	m.CreatorID = id
	m.ID = MessageID(bson.NewObjectId().Hex())
	err = ms.Session.DB(ms.DatabaseName).C(ms.MsgColName).Insert(m)
	return m, err
}

// UpdateMessage applies the MessageUpdates to the current message
func (ms *MongoStore) UpdateMessage(updates *MessageUpdates, currentmessage *Message) (*Message, error) {
	updates.EditedAt = time.Now()
	col := ms.Session.DB(ms.DatabaseName).C(ms.MsgColName)
	messageupdates := bson.M{"$set": updates}
	err := col.UpdateId(currentmessage.ID, messageupdates)
	if err != nil {
		return nil, err
	}
	updatedmessage := currentmessage
	updatedmessage.Body = updates.Body

	return updatedmessage, nil
}

// DeleteMessage deletes a message
func (ms *MongoStore) DeleteMessage(id MessageID) error {
	err := ms.Session.DB(ms.DatabaseName).C(ms.MsgColName).RemoveId(id)
	return err
}

// NewMongoStore constructs a new MongoStore using the provided
// addr. If the 'mongoAddr' is nil, it will use a default port and host
// Ensures atleast one public channel named "general"
// to ensure users have somewhere to post messages
func NewMongoStore(mongoAddr, DBName, ChanColName, MsgColName string) (*MongoStore, error) {
	sess, err := mgo.Dial(mongoAddr)
	if err != nil {
		return nil, err
	}

	if len(DBName) == 0 {
		DBName = DefaultDBName
	}

	if len(ChanColName) == 0 {
		ChanColName = DefaultChanColName
	}

	if len(MsgColName) == 0 {
		MsgColName = DefaultMsgColName
	}

	//If the channel collection has no public channels, start a 'general' public Channel
	if n, _ := sess.DB(DBName).C(ChanColName).Find(bson.M{"private": false}).Count(); n == 0 {
		nch := &NewChannel{
			Name:        "general",
			Description: "This channel is open to all members",
			Private:     false,
			Type:        0,
		}
		ch, err := nch.ToChannel()
		if err != nil {
			return nil, err
		}
		ch.ID = ChannelID(bson.NewObjectId().Hex())
		if err := sess.DB(DBName).C(ChanColName).Insert(ch); err != nil {
			return nil, fmt.Errorf("error starting empty DB: " + err.Error())
		}
	}

	return &MongoStore{
		Session:      sess,
		DatabaseName: DBName,
		ChanColName:  ChanColName,
		MsgColName:   MsgColName,
	}, nil
}
