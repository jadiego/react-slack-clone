package mq

import (
	"log"
	"time"

	"github.com/jadiego/react-slack-clone/servers/gateway/handlers"
	"github.com/streadway/amqp"
)

const (
	// MaxConnRetries is the default number of times we retry to
	// reconnect to a RabbitMQ server
	MaxConnRetries = 25
	// MessagingQueueName represents the name of the queue where all messaging
	// event messages are sent to
	MessagingQueueName = "messaging"
)

// ListenToMessagingMQ connects to a RabbitMQ server, and subscribes for messages,
// which it then notifies all Websocket connections
func ListenToMessagingMQ(addr string, notifier *handlers.Notifier) {
	// connect to RabbitMQ server
	conn, err := connectToMQ(addr)
	if err != nil {
		log.Fatalf("Error connecting to MQ server: %s\n", err)
	}
	defer conn.Close()

	// create a channel
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %s\n", err)
	}
	ch.Confirm(false)
	defer ch.Close()

	// declare a queue for us to send to
	q, err := ch.QueueDeclare(
		MessagingQueueName, // name
		false,              // durable
		false,              // delete when unused
		false,              // exclusive
		false,              // no-wait
		nil,                // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %s\n", err)
	}

	// consume the message from the queue
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)

	log.Printf("Successfully connected to MQ server\n")
	if err != nil {
		log.Fatalf("error listening to queue: %v", err)
	}

	for msg := range msgs {
		// Load messages received from RabbitMQ's eventQ channel to
		// notifier's eventQ channel, so that messages will be
		// broadcasted to all clients throught websocket.
		notifier.Notify(msg.Body)
	}
}

// connectToMQ attempts to connect to a RabbitMQ server several times
// with increased time intervals in between
func connectToMQ(addr string) (*amqp.Connection, error) {
	var conn *amqp.Connection
	var err error

	for i := 0; i < MaxConnRetries; i++ {
		conn, err = amqp.Dial(addr)
		if err != nil {
			log.Printf("Failed to connect to MQ server at %s: %s\n", addr, err)
			log.Printf("Will attempt again in %d seconds\n", i*4)
			time.Sleep(time.Duration(i*4) * time.Second)
		} else {
			return conn, nil
		}
	}

	defer conn.Close()
	return conn, err
}
