// chained operations that contains wrapper functions
// that might dispatch one or more actions

import { Dispatch } from "redux";
import { Actions } from "../action-helper";
import { actions } from "../actions";
import { setToken, getToken, deleteToken, fillChanName } from "../util";
import { AppError, handleError } from "../../errors";
import { model } from "..";

export const showMessageBar = actions.showMessageBarUI;

export const hideMessageBar = actions.clearMessageBarUI;

export const setCurrentChannel = (chan: model.Channel) => async (
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) => {
  try {
    if (chan.name.length === 0) {
      let { users, currentUser  } = getState();
      chan = fillChanName(chan, users, currentUser!);
    }
    dispatch(actions.setChannel(chan));
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Returns null if singin is succesful, returns error message if error occured.
 * POST /v1/sessions
 */
export const signin = (email: string, password: string) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.clearMessageBarUI());
    dispatch(actions.signinStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if (resp.ok) {
      dispatch(actions.signinSuccess(await resp.json()));
      let key = resp.headers.get("authorization")!;
      setToken(key);
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(dispatch, actions.signinError(err.message), err.message);
  }
};

/**
 * Returns null if signup is succesful, returns error message if error occured.
 * POST /v1/users
 */
export const signup = ({ ...args }: model.SignupFormArgs) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.clearMessageBarUI());
    dispatch(actions.signupStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args)
    });
    if (resp.ok) {
      dispatch(actions.signupSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(dispatch, actions.signupError(err.message), err.message);
  }
};

/**
 * Get user info using Auth token currently stored in local storage.
 * If fetch fails, then deletes key currently held at local storage.
 * GET /v1/users/me
 */
export const checkSession = () => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.createSessionStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "users/me", {
      headers: {
        Authorization: getToken()!
      }
    });
    if (resp.ok) {
      dispatch(actions.createSessionSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    deleteToken();
    return handleError(
      dispatch,
      actions.createSessionError(err.message),
      err.message
    );
  }
};

/**
 * Retrieves list of all signed-up users
 * GET /v1/users
 */
export const getUsers = () => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.getUsersStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "users");
    if (resp.ok) {
      dispatch(actions.getUsersSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.getUsersError(err.message),
      err.message
    );
  }
};

/**
 * Retrieves list of all channels available to user
 * GET /v1/channels
 */
export const getChannels = () => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.getChannelsStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "channels", {
      headers: {
        Authorization: getToken()!
      }
    });
    if (resp.ok) {
      dispatch(actions.getChannelsSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.getChannelsError(err.message),
      err.message
    );
  }
};

/**
 * Retrieves the channel messages with the given channel id
 * GET /v1/channels/<id>
 */
export const getChannelMessages = (channelid: string) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.getMessagesStart());
    let resp = await fetch(
      process.env.REACT_APP_API_ROOT + "channels/" + channelid,
      {
        headers: {
          Authorization: getToken()!
        }
      }
    );
    if (resp.ok) {
      dispatch(actions.getMessagesSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.getMessagesError(err.message),
      err.message
    );
  }
};

/**
 * Creates a message for the channel
 * POST /v1/messages
 */
export const postMessage = (text: string) => async (
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) => {
  try {
    dispatch(actions.postMessageStart());
    const { currentChannel } = getState();
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "messages", {
      method: "POST",
      headers: {
        Authorization: getToken()!
      },
      body: JSON.stringify({ channelid: currentChannel!.id, body: text })
    });
    if (resp.ok) {
      dispatch(actions.postMessageSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.postMessageError(err.message),
      err.message
    );
  }
};

/**
 * Creates a channel with given arguments
 * POST /v1/channels
 */
export const createChannel = (
  args: model.NewChannelFormArgs | model.NewDMChannelFormArgs
) => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.createChannelStart());
    let resp = await fetch(
      process.env.REACT_APP_API_ROOT + "channels?type=" + args.type,
      {
        method: "POST",
        headers: {
          Authorization: getToken()!
        },
        body: JSON.stringify(args)
      }
    );
    if (resp.ok) {
      dispatch(actions.createChannelSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.createChannelError(err.message),
      err.message
    );
  }
};

/**
 * Deletes the channel with given id
 * DELETE /v1/channels/<id>
 */
export const deleteChannel = (id: string) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.deleteChannelStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + `channels/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: getToken()!
      }
    });
    if (resp.ok) {
      dispatch(actions.deleteChannelSuccess(id));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.deleteChannelError(err.message),
      err.message
    );
  }
};

/**
 * Updates the channel with given id and args
 * DELETE /v1/channels/<id>
 */
export const updateChannel = (
  id: string,
  args: model.EditChannelFormArgs
) => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.updateChannelStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + `channels/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: getToken()!
      },
      body: JSON.stringify(args)
    });
    if (resp.ok) {
      dispatch(actions.updateChannelSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.updateChannelError(err.message),
      err.message
    );
  }
};

/**
 * Helper async action creator that moves UI back to the general channel. This method will
 * get called when we delete a channel we are currently on
 */
export const moveBackToGeneralChannel = () => async (
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) => {
  try {
    const { channels } = getState();
    let genchan = channels.find(chan => chan.name === "general")!;
    dispatch(actions.getMessagesStart());
    let resp = await fetch(
      process.env.REACT_APP_API_ROOT + "channels/" + genchan.id,
      {
        headers: {
          Authorization: getToken()!
        }
      }
    );
    if (resp.ok) {
      dispatch(actions.getMessagesSuccess(await resp.json()));
      dispatch(actions.setChannel(genchan));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(
      dispatch,
      actions.deleteChannelError(err.message),
      err.message
    );
  }
};
