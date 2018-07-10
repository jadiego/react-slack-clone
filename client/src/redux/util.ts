import { model } from ".";
import * as moment from "moment";

export function formatMsg(
  message: model.Message,
  users: {}
): model.FormattedMessage {
  return {
    id: message.id,
    date: moment(message.createdAt).format("LT"),
    message: message.body,
    photoUrl: users[message.creatorid].photoURL,
    name: users[message.creatorid].userName
  };
}

export function deleteToken() {
  localStorage.removeItem(process.env.REACT_APP_API_TOKEN_KEY!);
}

/**
 * Retrieves the token within localStorage if it exists. Returns
 * null if non-existent
 */
export function getToken(): string | null {
  return localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!);
}

/**
 * Sets the token within localStorage with the given param
 */
export function setToken(t: string) {
  localStorage.setItem(process.env.REACT_APP_API_TOKEN_KEY!, t);
}

export function fillChanName(
  chan: model.Channel,
  users: model.User[],
  currentUser: model.User
): model.Channel {
  let ids = [ chan.members[0], chan.creatorid ];
  if (ids[0] === ids[1]) {
    chan.name = currentUser.userName;
  } else {
    let otheruserid = ids.find((id) => id !== currentUser.id);
    chan.name = users.find((user) => user.id === otheruserid)!.userName;
  }
  return chan;
}
