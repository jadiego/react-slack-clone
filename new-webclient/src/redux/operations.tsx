// chained operations that contains wrapper functions
// that might dispatch one or more actions

import { Dispatch } from "redux";
import { Actions } from "./action-helper";
import { actions } from "./actions";
import * as types from "./types";

export const showMessageBar = actions.showMessageBarUI;

export const hideMessageBar = actions.clearMessageBarUI;

/**
 * Returns null if singin is succesful, returns error message if error occured.
 */
export const signin = (email: string, password: string) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.clearMessageBarUI());
    dispatch(actions.fetchSigninStart());
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
    if (resp.status === 200) {
      dispatch(actions.fetchSigninSuccess(await resp.json()));
      let key = resp.headers.get("authorization");
      localStorage.setItem(
        process.env.REACT_APP_API_TOKEN_KEY as string,
        key as string
      );
      return null;
    } else {
      throw new Error(await resp.text());
    }
  } catch (err) {
    let message = err.toString();
    dispatch(actions.fetchSigninError(message));
    return message;
  }
};

/**
 * Returns null if signup is succesful, returns error message if error occured.
 */

export const signup = ({ ...args }: types.SignupFormArgs) => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    dispatch(actions.clearMessageBarUI());
    dispatch(actions.fetchSignupStart());
    let resp = await fetch(process.env.REACT_APP_API_ROOT + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args)
    });
    if (resp.status !== 200) {
      throw new Error(await resp.text());
    } else {
      dispatch(actions.fetchSignupSuccess(await resp.json()));
      return null;
    }
  } catch (err) {
    let message = err.toString();
    dispatch(actions.fetchSignupError(message));
    return message;
  }
};
