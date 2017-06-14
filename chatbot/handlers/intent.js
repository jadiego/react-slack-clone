"use strict";

const moment = require("moment");

const mostMessages = async function (res, data, store, user) {
  let channelname = grabChannelFromData(data);
  let channel = await store.getChannel(channelname);
  ifChannelExists(channel, res, async function () {
    let users = await store.mostMessages(channel["_id"]);

    let user = await store.getUser(users[0]["_id"]);
    res.send(`For the ${channel.name} channel, ${user.firstname} ${user.lastname} made the most posts.`);
  })
}

const memberMessages = async function (res, data, store, user) {
  let channelname = grabChannelFromData(data);
  let channel = await store.getChannel(channelname);
  ifChannelExists(channel, res, async function () {
    let members = await store.getUsers(channel.members);
    let membersnames = ""
    members.map(m => {
      membersnames = membersnames + `${m.firstname} ${m.lastname},`
    })
    res.send(`${membersnames} are the members of the ${channelname} channel.`);
  })
}

const lateMessage = async function (res, data, store, user) {
  let channelname = grabChannelFromData(data);
  if (channelname) {
    let channel = await store.getChannel(channelname);
    ifChannelExists(channel, res, async function () {
      let message = await store.getLastMessage(user.id, channel["_id"]);
      if (message) {
        res.send(`Your last message in the ${channel.name} channel was on ${moment(message.createdat).format("LLL")}.`);
      } else {
        res.send(`You haven't posted a message to this channel yet silly! Try another channel.`);
      }
    })
  } else {
    let message = await store.getLastMessage(user.id);
    if (message) {
      res.send(`Your last message was on ${moment(message.createdat).format("LLL")}.`);
    } else {
      res.send(`You haven't posted a message to this channel yet silly! Try another channel.`);
    }
  }
}

const countMessages = async function (res, data, store, user) {
  let channelname = grabChannelFromData(data);
  let channel = await store.getChannel(channelname);
  ifChannelExists(channel, res, async function () {
    if (data.entities.datetime !== undefined) {
      let date = data.entities.datetime[0].value;
      let count = await store.countMessages(user.id, channel["_id"], date);
      res.send(`On ${moment(date).format("LL")}, you posted ${count} messages in the ${channel.name} channel.`);
    } else {
      let count = await store.countMessages(user.id, channel["_id"]);
      res.send(`Overall, you posted ${count} messages in the ${channel.name} channel.`);
    }
  })
}

const grabChannelFromData = function (data) {
  if (data.entities.channel === undefined) {
    return null;
  }

  let channelname = data.entities.channel[0].value;
  if (channelname.includes("channel")) {
    channelname = channelname.split(" ")[0];
  }
  return channelname;
}

const ifChannelExists = function (channel, res, callback) {
  if (channel) {
    callback();
  } else {
    res.send(`Sorry I don't quite understand what you meant. Please ask again.`);
  }
}

module.exports = {
  lateMessage,
  countMessages,
  mostMessages,
  memberMessages
}
