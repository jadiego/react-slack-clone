package sessions

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis"
)

// redisKeyPrefix is the prefix we will use for keys
// related to session IDs. This keeps session ID keys
// separate from other keys in the shared redis key
// namespace.
const redisKeyPrefix = "sid:"

// RedisStore represents a session.Store backed by redis.
type RedisStore struct {
	// Redis client used to talk to redis server.
	Client *redis.Client
	// Used for key expiry time on redis.
	SessionDuration time.Duration
}

// NewRedisStore constructs a new RedisStore, using the provided client and
// session duration. If the `client` is nil, it will be set to redis.NewClient()
// pointing at a local redis instance. If `sessionDuration` is negative, it will
// be set to `DefaultSessionDuration`.
func NewRedisStore(client *redis.Client, sessionDuration time.Duration) *RedisStore {
	// set defaults for parameters
	// if `client` is nil, set it to a redis.NewClient()
	// pointing at a redis instance on the same machine
	ropts := redis.Options{
		Addr: "localhost",
	}
	if client == nil {
		client = redis.NewClient(&ropts)
	}

	// if `sessionDuration` is < 0
	// set it to DefaultSessionDuration
	if sessionDuration < 0 {
		sessionDuration = DefaultSessionDuration
	}

	// return a new RedisStore with the Client field set to `client`
	// and the SessionDuration field set to `sessionDuration`
	return &RedisStore{
		Client:          client,
		SessionDuration: sessionDuration,
	}
}

// Save associates the provided `state` data with the provided `sid` in the store.
func (rs *RedisStore) Save(sid SessionID, state interface{}) error {
	//encode the `state` into JSON
	j, err := json.Marshal(state)
	if err != nil {
		return err
	}

	// use the redis client's Set() method, using `sid.getRedisKey()`
	// as the key, the JSON as the data, and the store's session duration
	// as the expiration
	err = rs.Client.Set(sid.getRedisKey(), j, rs.SessionDuration).Err()
	if err != nil {
		return err
	}

	return nil
}

// Get retrieves the previously saved data for the session id,
// and populates the `state` parameter with it. This will also
// reset the data's time to live in the store.
func (rs *RedisStore) Get(sid SessionID, state interface{}) error {
	// Use the Pipeline feature of the redis
	// package to do both the get and the reset of the expiry time
	// in just one network round trip.
	pipe := rs.Client.Pipeline()
	defer pipe.Close()

	// use the .Get() method to get the data associated
	// with the key `sid.getRedisKey()`
	d := pipe.Get(sid.getRedisKey())

	// use the .Expire() command to reset the expiry duration
	// to the store's session duration
	exp := pipe.Expire(sid.getRedisKey(), rs.SessionDuration)

	// Execute all previously queued commands using one client-server roundtrip.
	pipe.Exec()

	// Handle errors that might be returned from
	// previously executed commands.
	if d.Err() != nil {
		if d.Err() == redis.Nil {
			return ErrStateNotFound
		}
		return d.Err()
	}
	if exp.Err() != nil {
		return fmt.Errorf("error setting expiry time: %v", exp.Err())
	}

	// get the returned bytes and Unmarshal them into
	// the `state` parameter
	// if you get an error, return it
	b, err := d.Bytes()
	if err != nil {
		return err
	}
	if err := json.Unmarshal(b, state); err != nil {
		return err
	}

	return nil
}

// Delete deletes all data associated with the session id from the store.
func (rs *RedisStore) Delete(sid SessionID) error {
	// use the .Del() method to delete the data associated
	// with the key `sid.getRedisKey()`, and use .Err()
	// to report any errors that occurred
	d := rs.Client.Del(sid.getRedisKey())

	if d.Err() != nil {
		return d.Err()
	}

	return nil
}

// returns the key to use in redis
func (sid SessionID) getRedisKey() string {
	return redisKeyPrefix + sid.String()
}
