// chained operations that contains wrapper functions
// that might dispatch one or more actions

import { Dispatch } from "redux";
import { Actions } from "./action-helper";
import { actions } from "./actions";
import { model } from ".";
import { handleError, AppError } from "../errors";

export const showMessageBar = actions.showMessageBarUI;

export const hideMessageBar = actions.clearMessageBarUI;

export const setCurrentChannel = actions.setChannel;

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
      localStorage.setItem(process.env.REACT_APP_API_TOKEN_KEY!, key);
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
        "Authorization": localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!)!,
      }
    });
    if (resp.ok) {
      dispatch(actions.createSessionSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    localStorage.removeItem(process.env.REACT_APP_API_TOKEN_KEY!);
    return handleError(dispatch, actions.createSessionError(err.message), err.message);
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
    return handleError(dispatch, actions.getUsersError(err.message), err.message);
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
        "Authorization": localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!)!,
      }
    });
    if (resp.ok) {
      dispatch(actions.getChannelsSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(dispatch, actions.getChannelsError(err.message), err.message);
  }
}

export const getChannelMessages = (channelid: string) => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.getMessagesStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "channels/" + channelid, {
      headers: {
        "Authorization": localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!)!,
      }
    });
    if (resp.ok) {
      dispatch(actions.getMessagesSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(dispatch, actions.getMessagesError(err.message), err.message);
  }
}

export const postMessage = (text: string) => async (dispatch: Dispatch<Actions>, getState: () => model.StoreState) => {
  try {
    dispatch(actions.postMessageStart());
    const { currentChannel }  = getState()
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "messages", {
      method: "POST",
      headers: {
        "Authorization": localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!)!,
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
    return handleError(dispatch, actions.postMessageError(err.message), err.message);
  }
}

export const createChannel = (args: model.NewChannelFormArgs) => async (dispatch: Dispatch<Actions>) => {
  try {
    dispatch(actions.createChannelStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "channels", {
      method: "POST",
      headers: {
        "Authorization": localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY!)!,
      },
      body: JSON.stringify(args),
    });
    if (resp.ok) {
      dispatch(actions.createChannelSuccess(await resp.json()));
      return null;
    } else {
      throw AppError(resp.status, await resp.text());
    }
  } catch (err) {
    return handleError(dispatch, actions.createChannelError(err.message), err.message);
  }
}
