"use strict";

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const MessageStore = require('./models/messages/mongostore.js');

const host = process.env.HOST || "";
const port = process.env.PORT || "80";
const mongoAddr = process.env.MONGOADDR || 'localhost:27017';

const app = express();

//for request logging
app.use(morgan(process.env.LOGFORMAT || "dev"));

//middleware that parses any JSON posted to this app.
//the parsed data will be available on the req.body property
app.use(bodyParser.json());

mongodb.MongoClient.connect(`mongodb://${mongoAddr}/chat`)
  .then(db => {
    let colChannels = db.collection('channels');
    let colMessages = db.collection('messages');
    let store = new MessageStore(colChannels, colMessages)
    let handlers = require('./handlers/messages.js');
    app.use(handlers(store))

    //error handler
    app.use((err, req, res, next) => {
      console.log(err);
      res.status(err.status || 500).send(err.message);
    });

    app.listen(port, host, () => {
      console.log(`server is listening at http://${host}:${port}...`)
    });
  })
  .catch(err => {
    console.error(err);
  })