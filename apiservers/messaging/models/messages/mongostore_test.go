package messages

import (
	"strconv"
	"testing"
	"time"

	"github.com/jadiego/react-slack-clone/apiservers/gateway/models/users"
)

// NOTE: tests in this file will use the MONGOADDR
// environment variable for the mongodb server address.
// If not defined, it will default to a local instance of mongoDB.
// To start a local redis server using Docker, run
// this command:
// docker container run -d -p 27017:27017 --name testmongo mongo

// TestMongoStore tests the full CRUD lifecycle
func TestMongoStore(t *testing.T) {
	//start messages db
	mdb, err := NewMongoStore("", "", "", "")
	if err != nil {
		t.Fatalf(err.Error())
	}
	defer mdb.Session.Close()

	userid1 := users.UserID("590035312ec886172f6d1df7")
	userid2 := users.UserID("59078e1b2ec8865ac6a191b3")

	// create fake chan with random name
	name := randomStr()
	newch := &NewChannel{
		Name: name,
	}
	ch, err := mdb.InsertChannel(userid1, newch)
	if err != nil {
		t.Fatalf("error inserting channel: %v", err.Error())
	}

	// get channel just created
	_, err = mdb.GetChannelByID(ch.ID)
	if err != nil {
		t.Fatalf("error getting viewable channels: %v", err.Error())
	}

	// update channel
	cu := &ChannelUpdates{
		Name:        randomStr(),
		Description: "new description",
	}
	_, err = mdb.UpdateChannel(cu, ch)
	if err != nil {
		t.Fatalf("error updating channel: %v", err.Error())
	}

	// test inserting message
	nm := &NewMessage{
		ChannelID: ch.ID,
		Body:      "some random text",
	}
	msg, err := mdb.InsertMessage(userid1, nm)
	if err != nil {
		t.Fatalf("error inserting message: %v", err.Error())
	}

	// test deleting message
	err = mdb.DeleteMessage(msg.ID)
	if err != nil {
		t.Fatalf("error deleting message: %v", err.Error())
	}

	// test adding member to channel
	err = mdb.AddChannelMember(userid2, ch)
	if err != nil {
		t.Fatalf("error adding member to channel: %v", err.Error())
	}

	// test removing member to channel
	err = mdb.RemoveChannelmember(userid2, ch)
	if err != nil {
		t.Fatalf("error removing member to channel: %v", err.Error())
	}
}

// TestGetMyChanels tests a public channel and private DM channel
// is retrieved succesfully when queried
func TestGetMyChannels(t *testing.T) {
	//start messages db
	mdb, err := NewMongoStore("", "", "", "")
	if err != nil {
		t.Fatalf(err.Error())
	}
	defer mdb.Session.Close()

	userid1 := users.UserID("590035312ec886172f6d1df7")
	userid2 := users.UserID("59078e1b2ec8865ac6a191b3")

	// create fake chan with random name
	name := randomStr()
	newch := &NewChannel{
		Name: name,
	}
	ch, err := mdb.InsertChannel(userid1, newch)
	if err != nil {
		t.Fatalf("error inserting channel: %v", err.Error())
	}

	// create dm chan
	// create fake chan with random name
	newdmch := &NewDMChannel{
		Members: []users.UserID{userid2},
		Type:    1,
	}
	dmch, err := mdb.InsertDMChannel(userid1, newdmch)
	if err != nil {
		t.Fatalf("error inserting channel: %v", err.Error())
	}
	defer mdb.DeleteChannel(dmch.ID)

	chs, err := mdb.GetMyChannels(userid2)
	if err != nil {
		t.Fatalf("error getting channels: %v", err.Error())
	}
	for _, channel := range chs {
		if channel.Type == 0 {
			if channel.Private {
				t.Fatalf("pulled a private channel: \n%v\n%v\n", channel, ch)
			}
		} else {
			if dmch.Members[0] != userid2 {
				t.Fatalf("got the wrong private channel: \n%v\n%v\n", channel, dmch)
			}
		}
	}
}

func randomStr() string {
	return strconv.Itoa(int(time.Now().Unix()))
}
