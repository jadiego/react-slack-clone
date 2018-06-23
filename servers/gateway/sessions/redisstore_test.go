package sessions

import (
	"os"
	"reflect"
	"testing"

	"github.com/go-redis/redis"
)

/*
TestRedisStore tests the RedisStore object
Because the redis.Client is a struct and not an interface,
this is really more of an integration than a unit test.
It tests the basic CRUD cycle, ensuring that session state
saved to redis can be retrieved again.

By default, the test will try to use a local instance of
redis running on its default port (6379). If you want to
use a different address, set the REDISADDR environment variable.

To start a local redis server using Docker, run this command:
	docker container run -d -p 6379:6379 redis
*/
func TestRedisStore(t *testing.T) {
	type State struct {
		Requests int
	}

	sid, err := NewSessionID(testSigningKey)
	if nil != err {
		t.Fatal(err)
	}

	redisAddr := os.Getenv("REDISADDR")
	if len(redisAddr) == 0 {
		redisAddr = "127.0.0.1:6379"
	}
	client := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	redisStore := NewRedisStore(client, -1)

	state1 := &State{
		Requests: 100,
	}

	err = redisStore.Save(sid, state1)
	if nil != err {
		t.Fatal(err)
	}

	state2 := &State{}
	err = redisStore.Get(sid, state2)
	if nil != err {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(state1, state2) {
		t.Fatalf("Retrieved state did not match.\n got %v \n expected %v", state2, state1)
	}

	redisStore.Delete(sid)
	state3 := &State{}
	err = redisStore.Get(sid, state3)
	if ErrStateNotFound != err {
		t.Fatal(err)
	}

}
