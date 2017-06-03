"use strict";

const mongodb = require('mongodb');

/**
 * MongoStore is a concrete store for Message model
 */
class MongoStore {
  /**
   * 
   * @param {mongodb.Collection} collection 
   */
  constructor(colChannels, colMessages) {
    this.ChannelCol = colChannels;
    this.MessagesCol = colMessages;
  }
}

module.exports = MongoStore;