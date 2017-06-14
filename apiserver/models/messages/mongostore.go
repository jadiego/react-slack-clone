package messages

import (
	"time"

	"fmt"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//MongoStore represents a stories.Store backed by MongoDB
type MongoStore struct {
	Session                *mgo.Session
	DatabaseName           string
	ChannelsCollectionName string
	MessagesCollectionName string
}

//GetMyChannels get all channels a given user is allowed to see (i.e.,
//channels the user is a member of, as well as all public channels, if is creator)
func (ms *MongoStore) GetMyChannels(id users.UserID) ([]*Channel, error) {
	channels := []*Channel{}
	idquery := bson.M{"members": id}
	privatequery := bson.M{"private": false}
	query := bson.M{"$or": []bson.M{idquery, privatequery}}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).Find(query).All(&channels)
	return channels, err
}

//GetChannelByID gets a single channel by the given id parameter
func (ms *MongoStore) GetChannelByID(id ChannelID) (*Channel, error) {
	channel := &Channel{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).FindId(id).One(channel)
	if err == mgo.ErrNotFound {
		return nil, ErrChannelNotFound
	}
	return channel, err
}

//InsertChannel inserts a new channel into the store
func (ms *MongoStore) InsertChannel(id users.UserID, newchannel *NewChannel) (*Channel, error) {
	c := newchannel.ToChannel()

	//attach creator's id in new channel
	c.CreatorID = id
	//create id of channel
	c.ID = ChannelID(bson.NewObjectId().Hex())

	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).Insert(c)
	return c, err
}

//GetChannelMessages gets the most recent N messages posted to
//a particular channel
func (ms *MongoStore) GetChannelMessages(id ChannelID, n int) ([]*Message, error) {
	messages := []*Message{}
	query := bson.M{"channel_id": id}
	err := ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName).Find(query).Sort("createdAt").Limit(n).All(&messages)
	return messages, err
}

//UpdateChannel updates a channels name and description
func (ms *MongoStore) UpdateChannel(updates *ChannelUpdates, currentchannel *Channel) (*Channel, error) {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName)
	channelupdates := bson.M{"$set": updates}
	err := col.UpdateId(currentchannel.ID, channelupdates)
	if err != nil {
		return nil, err
	}
	updatedchannel := currentchannel
	updatedchannel.Name = updates.Name
	updatedchannel.Description = updates.Description

	return updatedchannel, nil
}

//DeleteChannel delete a channel, as well as all messages posted to that channel
func (ms *MongoStore) DeleteChannel(id ChannelID) error {
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).RemoveId(id)
	if err != nil {
		return err
	}

	_, err = ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName).RemoveAll(bson.M{"channel_id": id})
	if err != nil {
		return err
	}
	return nil
}

//AddChannelMember add a user to a channel's Members list
func (ms *MongoStore) AddChannelMember(id users.UserID, currentchannel *Channel) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName)
	memberupdates := bson.M{"$addToSet": bson.M{"members": id}}
	err := col.UpdateId(currentchannel.ID, memberupdates)
	return err
}

//RemoveChannelmember remove a user from a channel's Members list
func (ms *MongoStore) RemoveChannelmember(id users.UserID, currentchannel *Channel) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName)
	memberupdates := bson.M{"$pull": bson.M{"members": id}}
	err := col.UpdateId(currentchannel.ID, memberupdates)
	return err
}

//GetMessageByID gets a single message by the given id parameter
func (ms *MongoStore) GetMessageByID(id MessageID) (*Message, error) {
	message := &Message{}
	err := ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName).FindId(id).One(message)
	if err == mgo.ErrNotFound {
		return nil, ErrMessageNotFound
	}
	return message, err
}

//InsertMessage inserts a new message and returns a new Message
//with a newly assigned ID
func (ms *MongoStore) InsertMessage(id users.UserID, newmessage *NewMessage) (*Message, error) {
	m := newmessage.ToMessage()
	m.CreatorID = id
	m.ID = MessageID(bson.NewObjectId().Hex())
	err := ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName).Insert(m)
	return m, err
}

//UpdateMessage applies the MessageUpdates to the current message
func (ms *MongoStore) UpdateMessage(updates *MessageUpdates, currentmessage *Message) (*Message, error) {
	updates.EditedAt = time.Now()
	col := ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName)
	messageupdates := bson.M{"$set": updates}
	err := col.UpdateId(currentmessage.ID, messageupdates)
	if err != nil {
		return nil, err
	}
	updatedmessage := currentmessage
	updatedmessage.Body = updates.Body

	return updatedmessage, nil
}

//DeleteMessage deletes a message
func (ms *MongoStore) DeleteMessage(id MessageID) error {
	err := ms.Session.DB(ms.DatabaseName).C(ms.MessagesCollectionName).RemoveId(id)
	return err
}

//NewMongoStore constructs a new MongoStore using the provided
//addr. If the 'mongoAddr' is nil, it will use a default port and host
func NewMongoStore(mongoAddr, DBName, ChannelCollectionName, MessageCollectionName string) (*MongoStore, error) {
	if len(mongoAddr) == 0 {
		mongoAddr = "localhost:27017"
	}

	sess, err := mgo.Dial(mongoAddr)
	if err != nil {
		return nil, err
	}

	if len(DBName) == 0 {
		DBName = "chat"
	}

	if len(ChannelCollectionName) == 0 {
		ChannelCollectionName = "channels"
	}

	if len(MessageCollectionName) == 0 {
		MessageCollectionName = "messages"
	}

	//If the channel collection has no public channels, start a 'general' public Channel
	if n, _ := sess.DB(DBName).C(ChannelCollectionName).Find(bson.M{"private": false}).Count(); n == 0 {
		nch := &NewChannel{
			Name:        "general",
			Description: "This channel is open to all members",
			Private:     false,
		}
		ch := nch.ToChannel()
		ch.ID = ChannelID(bson.NewObjectId().Hex())
		if err := sess.DB(DBName).C(ChannelCollectionName).Insert(ch); err != nil {
			return nil, fmt.Errorf("error starting empty DB: " + err.Error())
		}
	}

	return &MongoStore{
		Session:                sess,
		DatabaseName:           DBName,
		ChannelsCollectionName: ChannelCollectionName,
		MessagesCollectionName: MessageCollectionName,
	}, nil
}
