package messages

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/jadiego/react-slack-clone/apiserver/models/users"
	"github.com/jadiego/react-slack-clone/apiserver/websocket"
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
	Body     string    `json:"body"`
	EditedAt time.Time `json:"editedAt"`
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
	time := time.Now()
	m := &Message{
		ChannelID: nm.ChannelID,
		Body:      nm.Body,
		CreatedAt: time,
		EditedAt:  time,
	}

	return m
}

//ToNewMessageEvent converts the message to a message event for
//a websocket notification
func (m *Message) ToNewMessageEvent() (*notifier.MessageEvent, error) {
	jsonstring, err := json.Marshal(m)
	return &notifier.MessageEvent{
		Type:      notifier.NewMessage,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}

//ToUpdatedMessageEvent converts the message to a message event for
//a websocket notification
func (m *Message) ToUpdatedMessageEvent() (*notifier.MessageEvent, error) {
	jsonstring, err := json.Marshal(m)
	return &notifier.MessageEvent{
		Type:      notifier.UpdatedMessage,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}

//ToDeletedMessageEvent converts the message to a message event for
//a websocket notification
func (m *Message) ToDeletedMessageEvent() (*notifier.MessageEvent, error) {
	jsonstring, err := json.Marshal(m)
	return &notifier.MessageEvent{
		Type:      notifier.DeletedMessage,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}
