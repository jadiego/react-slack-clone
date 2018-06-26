const mongodb = require("mongodb");
const moment = require("moment");

/**
 * MongoStore is a concrete store for Message model
 */
class MongoStore {
  /**
   * constructs a new MongoStore
   * @param {mongodb.Collection} colChannels
   * @param {mongodb.Collection} colMessages
   * @param {mongodb.Collection} colUsers
   */
  constructor(colChannels, colMessages, colUsers) {
    this.ChannelCol = colChannels;
    this.MessagesCol = colMessages;
    this.UsersCol = colUsers;
  }

  /**
   * grabs the single channel from the store
   * @param {string} name
   */
  async getChannel(name) {
    let query = { name: name };
    let channel = await this.ChannelCol.findOne(query);
    return channel;
  }

  /**
   * grabs the single user from the store
   * @param {string} id
   */
  async getUser(id) {
    let query = { _id: id };
    let user = await this.UsersCol.findOne(query);
    return user;
  }

  /**
   * grabs the single user from the store
   * @param {array} memberids
   */
  async getUsers(memberids) {
    let query = { _id: { $in: memberids } };
    let cursor = await this.UsersCol.find(query);
    let members = cursor.toArray();
    return members;
  }

  /**
   * grabs the most recent message of the user
   * @param {string} userid
   * @param {string} channelid
   */
  async getLastMessage(userid, channelid) {
    let query;
    if (channelid === undefined) {
      query = { creator_id: userid };
    } else {
      query = { creator_id: userid, channel_id: channelid };
    }
    let options = { sort: [["createdat", "desc"]] };
    let message = await this.MessagesCol.findOne(query, options);
    return message;
  }

  async countMessages(userid, channelid, date) {
    let query;
    if (date === undefined) {
      query = { creator_id: userid, channel_id: channelid };
    } else {
      var dateQuery = {
        $gte: moment(date)
          .startOf("day")
          .toDate(),
        $lt: moment(date)
          .endOf("day")
          .toDate()
      };
      query = {
        creator_id: userid,
        channel_id: channelid,
        createdat: dateQuery
      };
    }
    let count = await this.MessagesCol.count(query);
    return count;
  }

  async mostMessages(channelid) {
    let matchQuery = { $match: { channel_id: channelid } };
    let groupQuery = {
      $group: { _id: "$creator_id", count: { $sum: 1 } }
    };
    let sortQuery = { $sort: { count: -1 } };
    let query = [matchQuery, groupQuery, sortQuery];

    let cursor = await this.MessagesCol.aggregate(query);
    let results = await cursor.toArray();
    return results;
  }
}

module.exports = MongoStore;
