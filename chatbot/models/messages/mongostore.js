"use strict";

const mongodb = require('mongodb');
const moment = require("moment");

/**
 * MongoStore is a concrete store for Message model
 */
class MongoStore {
  /**
   * constructs a new MongoStore
   * @param {mongodb.Collection} colChannels
   * @param {mongodb.Collection} colMessages
   */
  constructor(colChannels, colMessages) {
    this.ChannelCol = colChannels;
    this.MessagesCol = colMessages;
  }

  /**
   * grabs the single channel from the store
   * @param {string} name
   */
  async getChannel(name) {
    let query = { "name": name };
    let channel = await this.ChannelCol.findOne(query);
    return channel;
  }

  /**
   * grabs the most recent message of the user
   * @param {string} id
   */
  async getLastMessage(userid, channelid) {
    if (channelid === undefined) {
      var query = { "creator_id": userid };
    } else {
      var query = { "creator_id": userid, "channel_id": channelid };
    }
    let options = { "sort": [["createdat", "desc"]] };
    let message = await this.MessagesCol.findOne(query, options);
    return message;
  }

  async countMessages(userid, channelid, date) {
    if (date === undefined) {
      var query = { "creator_id": userid, "channel_id": channelid };
    } else {
      var dateQuery = {
        "$gte": moment(date).startOf("day").toDate(),
        "$lt": moment(date).endOf("day").toDate()
      };
      var query = { "creator_id": userid, "channel_id": channelid, "createdat": dateQuery };
    }
    let count = await this.MessagesCol.count(query);
    return count;
  }
}

module.exports = MongoStore;
