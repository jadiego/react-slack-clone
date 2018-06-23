package mq

import (
	"fmt"
	"log"
	"time"

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

// MessagingMQ represents a connection to a rabbitMQ channel
type MessagingMQ struct {
	QueueName string
	Channel   *amqp.Channel
	Conn      *amqp.Connection
}

// NewMessagingMQ initializes a  RabbitMQ channel
// and returns it
func NewMessagingMQ(addr string) (*MessagingMQ, error) {
	// connect to RabbitMQ server
	conn, err := connectToMQ(addr)
	if err != nil {
		return nil, fmt.Errorf("error connecting to MQ server: %s", err)
	}

	// create a channel
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %s", err)
	}

	// to send we declare a queue for us to send to
	q, err := ch.QueueDeclare(
		MessagingQueueName, // name
		false,              // durable
		false,              // delete when unused
		false,              // exclusive
		false,              // no-wait
		nil,                // arguments
	)

	return &MessagingMQ{
		QueueName: q.Name,
		Channel:   ch,
	}, nil
}

// PublishToMessagingMQ sends a message to the messaging RabbitMQ queue.
func (mq *MessagingMQ) PublishToMessagingMQ(body []byte) error {
	return mq.Channel.Publish(
		"",           // exchange
		mq.QueueName, // routing key
		false,        // mandatory
		false,        //immediate
		amqp.Publishing{
			ContentType: "application/json; charset=utf-8",
			Body:        body,
		})
}

// ConnectToMQ attempts to connect to a RabbitMQ server several times
// with increased time intervals in between
func connectToMQ(addr string) (*amqp.Connection, error) {
	var conn *amqp.Connection
	var err error

	for i := 0; i < MaxConnRetries; i++ {
		conn, err = amqp.Dial("amqp://" + addr)
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
