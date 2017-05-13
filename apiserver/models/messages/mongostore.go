package messages

import (
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
//channels the user is a member of, as well as all public channels)
func (ms *MongoStore) GetMyChannels(id users.UserID) ([]*Channel, error) {
	channels := []*Channel{}
	query := bson.M{"members": id, "private": false}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).Find(query).All(&channels)
	return channels, err
}

//InsertChannel inserts a new channel into the store
func (ms *MongoStore) InsertChannel(id users.UserID, newchannel *NewChannel) (*Channel, error) {
	c := newchannel.ToChannel()
	c.CreatorID = id
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
func (ms *MongoStore) UpdateChannel(updates *ChannelUpdates, currentchannel *Channel) error {
	col := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName)
	channelupdates := bson.M{"$set": updates}
	err := col.UpdateId(currentchannel.ID, channelupdates)
	return err
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
func (ms *MongoStore) AddChannelMember(member *users.User, currentchannel *Channel) error {
	//returns error if member is already a member of channel
	for _, v := range currentchannel.Members {
		if v == member.ID {
			return fmt.Errorf("user is already a member")
		}
	}

	membersupdates := bson.M{"$set": append(currentchannel.Members, member.ID)}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).UpdateId(currentchannel.ID, membersupdates)
	return err
}

//FIX WRONG IMPLEMENTATION
//RemoveChannelmember remove a user from a channel's Members list
func (ms *MongoStore) RemoveChannelmember(member *users.User, currentchannel *Channel) error {
	//returns error if member is already not a member of channel
	foundmember := false
	index := 0
	for i, v := range currentchannel.Members {
		if v == member.ID {
			foundmember = true
			index = i
			break
		}
	}
	if !foundmember {
		return fmt.Errorf("user is already not a member")
	}

	membersupdates := bson.M{"$set": append(currentchannel.Members, member.ID)}
	err := ms.Session.DB(ms.DatabaseName).C(ms.ChannelsCollectionName).UpdateId(currentchannel.ID, membersupdates)
	return err
}

// //InsertMessage inserts a new message and returns a new Message
// //with a newly assigned ID
// InsertMessage(id users.UserID, newmessage *NewMessage) (*Message, error)

// //UpdateMessage applies the MessageUpdates to the current message
// UpdateMessage(updates *MessageUpdates, currentmessage *Message) error

// //DeleteMessage deletes a message
// DeleteMessage(id MessageID) error
