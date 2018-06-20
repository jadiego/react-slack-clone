package messages

import (
	"fmt"
	"regexp"
	"time"

	"encoding/json"

	"github.com/jadiego/react-slack-clone/apiserver/models/users"
	"github.com/jadiego/react-slack-clone/apiserver/websocket"

	"strings"
)

// ChannelID defines the type for channel IDs
type ChannelID string

// Channel represents a a single chat room
// Type must be either 0 for a workspace channel or 1
// for a DM channel
type Channel struct {
	ID          ChannelID      `json:"id" bson:"_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	CreatedAt   time.Time      `json:"createdAt"`
	CreatorID   users.UserID   `json:"creatorid" bson:"creator_id"`
	Members     []users.UserID `json:"members"`
	Private     bool           `json:"private"`
	Type        uint8          `json:"type"`
}

// NewChannel represents a new workspace channel a user creates.
// Only name is required when creating a new channel.
type NewChannel struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Members     []users.UserID `json:"members"`
	Private     bool           `json:"private"`
	Type        uint8          `json:"type"`
}

// NewDMChannel represents a new DM channel
type NewDMChannel struct {
	Members []users.UserID `json:"members"`
	Type    uint8          `json:"type"`
	Private bool           `json:"private"`
}

// ChannelUpdates represents updates a user could make to a channel
type ChannelUpdates struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Validate validates the new channel
func (nc *NewChannel) Validate() error {

	// ensure Name is not empty
	if len(nc.Name) < 1 {
		return fmt.Errorf("channel name can't be empty")
	}

	splitString := strings.Fields(nc.Name)
	if len(splitString) > 1 {
		return fmt.Errorf("channel name can't contain spaces")
	}

	if len(nc.Name) > 21 {
		return fmt.Errorf("channel name too long")
	}

	match, _ := regexp.MatchString("^[A-Za-z0-9-]{1,21}$", nc.Name)
	if !match {
		return fmt.Errorf("name may only alphanumeric characters and hyphens (-)")
	}

	if len(nc.Description) > 1024 {
		return fmt.Errorf("channel description too long")
	}

	// if you made here, it's valid, so return nil
	return nil
}

// Validate validates the new channel updates
func (cu *ChannelUpdates) Validate() error {

	// ensure Name is not empty
	if len(cu.Name) < 1 {
		return fmt.Errorf("channel name can't be empty")
	}

	splitString := strings.Fields(cu.Name)
	if len(splitString) > 1 {
		return fmt.Errorf("channel name can't contain spaces")
	}

	if len(cu.Name) > 21 {
		return fmt.Errorf("channel name too long")
	}

	match, _ := regexp.MatchString("^[A-Za-z0-9-]{1,21}$", cu.Name)
	if !match {
		return fmt.Errorf("name may only alphanumeric characters and hyphens (-)")
	}

	if len(cu.Description) > 1024 {
		return fmt.Errorf("channel description too long")
	}

	// if you made here, it's valid, so return nil
	return nil
}

// ToChannel converts the NewChannel to a Channel
func (nc *NewChannel) ToChannel() *Channel {
	c := &Channel{
		Name:        nc.Name,
		Description: nc.Description,
		CreatedAt:   time.Now(),
		Members:     nc.Members,
		Private:     nc.Private,
		Type:        0,
	}

	return c
}

// ToChannel converts the NewDMChannel to a Channel
func (nc *NewDMChannel) ToChannel() *Channel {
	c := &Channel{
		CreatedAt: time.Now(),
		Members:   nc.Members,
		Private:   true,
		Type:      1,
	}

	return c
}

// IsMember checks if the given userID is a member
func (c *Channel) IsMember(id users.UserID) bool {
	for _, v := range c.Members {
		if v == id {
			return true
		}
	}
	return false
}

// ToNewChannelEvent converts the channel to a channel event for
// a websocket notification
func (c *Channel) ToNewChannelEvent() (*notifier.ChannelEvent, error) {
	jsonstring, err := json.Marshal(c)
	return &notifier.ChannelEvent{
		Type:      notifier.NewChannel,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}

// ToUpdatedChannelEvent converts the channel to a channel event for
// a websocket notification
func (c *Channel) ToUpdatedChannelEvent() (*notifier.ChannelEvent, error) {
	jsonstring, err := json.Marshal(c)
	return &notifier.ChannelEvent{
		Type:      notifier.UpdatedChannel,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}

// ToDeletedChannelEvent converts the channel to a channel event for
// a websocket notification
func (c *Channel) ToDeletedChannelEvent() (*notifier.ChannelEvent, error) {
	jsonstring, err := json.Marshal(c)
	return &notifier.ChannelEvent{
		Type:      notifier.DeletedChannel,
		Message:   string(jsonstring),
		CreatedAt: time.Now(),
	}, err
}
