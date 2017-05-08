package messages

import (
	"fmt"
	"time"

	"github.com/info344-s17/challenges-jadiego/apiserver/models/users"
)

//ChannelID defines the type for channel IDs
type ChannelID string

//Channel represents a a single chat room
type Channel struct {
	ID          ChannelID      `json:"id" bson:"_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	CreatedAt   time.Time      `json:"createdAt"`
	CreatorID   users.UserID   `json:"creatorid" bson:"creator_id"`
	Members     []users.UserID `json:"members"`
	Private     bool           `json:"private"`
}

//NewChannel represents a new channel a user creates
type NewChannel struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Members     []users.UserID `json:"members"`
	Private     bool           `json:"private"`
}

//ChannelUpdates represents updates a user could make to a channel
type ChannelUpdates struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

//Validate validates the new channel
func (nc *NewChannel) Validate() error {

	//ensure Name is not empty
	if len(nc.Name) < 1 {
		return fmt.Errorf("name can't be empty")
	}
	//if you made here, it's valid, so return nil
	return nil
}

//ToChannel converts the NewChannel to a Channel
func (nc *NewChannel) ToChannel() *Channel {
	c := &Channel{
		Name:        nc.Name,
		Description: nc.Description,
		Members:     nc.Members,
		Private:     nc.Private,
		CreatedAt:   time.Now(),
	}

	return c
}
