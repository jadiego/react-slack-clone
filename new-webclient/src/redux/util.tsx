import { model } from ".";
import * as moment from "moment";

export function formatMsg(message: model.Message, users: {}): model.FormattedMessage {
  return {
    id: message.id,
    date: moment(message.createdAt).format('LT'),
    message: message.body,
    photoUrl: users[message.creatorid].photoURL,
    name: users[message.creatorid].userName
  }
}

