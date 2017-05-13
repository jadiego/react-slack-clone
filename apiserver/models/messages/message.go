package messages

import (
	"fmt"
	"time"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
)

//MessageID defines the type for message IDs
type MessageID string

//Message represents a single message post within a channel
type Message struct {
	ID        MessageID    `json:"id" bson:"_id"`
	ChannelID ChannelID    `json:"channelid" bson:"channel_id"`
	Body      string       `json:"body"`
	CreatedAt time.Time    `json:"createdAt"`
	CreatorID users.UserID `json:"creatorid" bson:"creator_id"`
	EditedAt  time.Time    `json:"editedAt"`
}

//NewMessage represents a new message a user posts to a channel.
//A ChannelID and Body field is required for a new message.
type NewMessage struct {
	ChannelID ChannelID `json:"channelid" bson:"channel_id"`
	Body      string    `json:"body"`
}

//MessageUpdates represents updates a user could make to a message
type MessageUpdates struct {
	Body string `json:"body"`
}

//Validate validates the new message
func (nm *NewMessage) Validate() error {
	//ensure Name is not empty
	if len(nm.ChannelID) < 1 {
		return fmt.Errorf("channel can't be empty. no channel to post this to")
	}

	//ensure Name is not empty
	if len(nm.Body) < 1 {
		return fmt.Errorf("body can't be empty")
	}
	//if you made here, it's valid, so return nil
	return nil
}

//ToMessage converts the NewMessage to a Message
func (nm *NewMessage) ToMessage() *Message {
	m := &Message{
		ChannelID: nm.ChannelID,
		Body:      nm.Body,
		CreatedAt: time.Now(),
		EditedAt:  time.Now(),
	}

	return m
}
