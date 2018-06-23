// contains all the action creator functions
import { createAction } from "./action-helper";
import { SemanticCOLORS } from "semantic-ui-react";
import { types, model } from ".";
import { APIServerDownErrorMessage } from "../errors";

export const actions = {
  apiServerDownError: () => createAction(types.API_SERVER_DOWN_ERROR, APIServerDownErrorMessage),
  signinStart: () => createAction(types.SIGNIN_FETCH_START),
  signinSuccess: (user: model.User) => createAction(types.SIGNIN_FETCH_SUCCESS, user),
  signinError: (error: string) => createAction(types.SIGNIN_FETCH_ERROR, error),
  signupStart: () => createAction(types.SIGNUP_FETCH_START),
  signupSuccess: (user: any) => createAction(types.SIGNUP_FETCH_SUCCESS, user),
  signupError: (error: string) => createAction(types.SIGNUP_FETCH_ERROR, error),
  showMessageBarUI: (color: SemanticCOLORS, message: string) => createAction(types.UI_SHOW_MESSAGEBAR, { color, message }),
  clearMessageBarUI: () => createAction(types.UI_CLEAR_MESSAGEBAR),
  createSessionStart: () => createAction(types.SESSION_FETCH_START),
  createSessionSuccess: (user: model.User) => createAction(types.SESSION_FETCH_SUCCESS, user),
  createSessionError: (error: string) => createAction(types.SESSION_FETCH_ERROR, error),
  getUsersStart: () => createAction(types.USERS_FETCH_START),
  getUsersSuccess: (users: model.User[]) => createAction(types.USERS_FETCH_SUCCESS, users),
  getUsersError: (error: string) => createAction(types.USERS_FETCH_ERROR, error),
  getChannelsStart: () => createAction(types.CHANNELS_FETCH_START),
  getChannelsSuccess: (channels: model.Channel[]) => createAction(types.CHANNELS_FETCH_SUCCESS, channels),
  getChannelsError: (error: string) => createAction(types.CHANNELS_FETCH_ERROR, error),
  setChannel: (channel: model.Channel) => createAction(types.SET_CURRENT_CHANNEL, channel),
  getMessagesStart: () => createAction(types.MESSAGES_FETCH_START),
  getMessagesSuccess: (messages: model.Message[]) => createAction(types.MESSAGES_FETCH_SUCCESS, messages),
  getMessagesError: (error: string) => createAction(types.MESSAGES_FETCH_ERROR, error),
  postMessageStart: () => createAction(types.POST_MESSAGE_START),
  postMessageSuccess: (message: model.Message) => createAction(types.POST_MESSAGE_SUCCESS, message),
  postMessageError: (error: string) => createAction(types.POST_MESSAGE_ERROR, error),
  createChannelStart: () => createAction(types.CHANNELS_CREATE_START),
  createChannelSuccess: (channel: model.Channel) => createAction(types.CHANNELS_CREATE_SUCCESS, channel),
  createChannelError: (error: string) => createAction(types.CHANNELS_CREATE_ERROR, error),
  deleteChannelStart: () => createAction(types.DELETE_CHANNEL_START),
  deleteChannelSuccess: (message: string) => createAction(types.DELETE_CHANNEL_SUCCESS, message),
  deleteChannelError: (error: string) => createAction(types.DELETE_CHANNEL_ERROR, error),
  initWSStart: () => createAction(types.INIT_WS_START),
  initWSSuccess: () => createAction(types.INIT_WS_SUCCESS),
  initWSError: () => createAction(types.INIT_WS_ERROR),
};
