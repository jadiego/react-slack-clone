package messages

import (
	"os"
	"testing"

	"github.com/jadiego/react-slack-clone/apiserver/models/users"
)

func TestMongoStore(t *testing.T) {
	//start messages db
	mongoAddr := os.Getenv("MONGOADDR")
	mdb, err := NewMongoStore(mongoAddr, "", "", "")
	if err != nil {
		t.Fatalf(err.Error())
	}
	defer mdb.Session.Close()

	userid1 := users.UserID("590035312ec886172f6d1df7")
	userid2 := users.UserID("59078e1b2ec8865ac6a191b3")

	newch := &NewChannel{
		Name: "testing channel 234",
	}

	ch, err := mdb.InsertChannel(userid1, newch)
	if err != nil {
		t.Fatalf("error inserting channel: %v", err.Error())
	}

	_, err = mdb.GetMyChannels(userid1)
	if err != nil {
		t.Fatalf("error getting viewable channels: %v", err.Error())
	}

	cu := &ChannelUpdates{
		Name:        "new name",
		Description: "new description",
	}

	_, err = mdb.UpdateChannel(cu, ch)
	if err != nil {
		t.Fatalf("error updating channel: %v", err.Error())
	}

	nm := &NewMessage{
		ChannelID: ch.ID,
		Body:      "some random text",
	}

	msg, err := mdb.InsertMessage(userid1, nm)
	if err != nil {
		t.Fatalf("error inserting message: %v", err.Error())
	}

	err = mdb.DeleteMessage(msg.ID)
	if err != nil {
		t.Fatalf("error deleting message: %v", err.Error())
	}

	err = mdb.AddChannelMember(userid2, ch)
	if err != nil {
		t.Fatalf("error adding member to channel: %v", err.Error())
	}

	err = mdb.AddChannelMember(userid1, ch)
	if err != nil {
		t.Fatalf("error adding member to channel: %v", err.Error())
	}

	err = mdb.RemoveChannelmember(userid2, ch)
	if err != nil {
		t.Fatalf("error removing member to channel: %v", err.Error())
	}
}
