package messages

import (
	"errors"

	"github.com/jadiego/react-slack-clone/apiservers/gateway/models/users"
)

// ErrChannelNotFound is returned when the requested channel is not found in the store
var ErrChannelNotFound = errors.New("channel not found")

// ErrMessageNotFound is returned when the requested message is not found in the store
var ErrMessageNotFound = errors.New("message not found")

// Store represents an abstract store for model.channel and model.message objects.
type Store interface {
	// GetMyChannels get all channels a given user is allowed to see (i.e.,
	// channels the user is a member of, as well as all public channels)
	GetMyChannels(id users.UserID) ([]*Channel, error)

	// GetChannelByID gets a single channel by the given id parameter
	GetChannelByID(id ChannelID) (*Channel, error)

	// InsertChannel inserts a new channel into the store
	InsertChannel(id users.UserID, newchannel *NewChannel) (*Channel, error)

	// InsertDMChannel inserts a new DM channel into the store
	InsertDMChannel(id users.UserID, newchannel *NewDMChannel) (*Channel, error)

	// GetChannelMessages gets the most recent N messages posted to
	// a particular channel
	GetChannelMessages(id ChannelID, n int) ([]*Message, error)

	// UpdateChannel updates a channels name and description
	UpdateChannel(updates *ChannelUpdates, currentchannel *Channel) (*Channel, error)

	// DeleteChannel deletes a channel, as well as all messages posted to that channel
	DeleteChannel(id ChannelID) error

	// AddChannelMember add a user to a channel's Members list
	AddChannelMember(id users.UserID, currentchannel *Channel) error

	// RemoveChannelmember remove a user from a channel's Members list
	RemoveChannelmember(id users.UserID, currentchannel *Channel) error

	// GetMessageByID gets a single message by the given id parameter
	GetMessageByID(id MessageID) (*Message, error)

	// InsertMessage inserts a new message and returns a new Message
	// with a newly assigned ID
	InsertMessage(id users.UserID, newmessage *NewMessage) (*Message, error)

	// UpdateMessage applies the MessageUpdates to the current message
	UpdateMessage(updates *MessageUpdates, currentmessage *Message) (*Message, error)

	// DeleteMessage deletes a message
	DeleteMessage(id MessageID) error
}
