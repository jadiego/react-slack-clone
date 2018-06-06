// contains all the action creator functions
import { createAction } from "./action-helper";
import * as types from "./types";
import { SemanticCOLORS } from "semantic-ui-react";

export const actions = {
  fetchSigninStart: () => createAction(types.SIGNIN_FETCH_START),
  fetchSigninSuccess: (user: any) => createAction(types.SIGNIN_FETCH_SUCCESS, user),
  fetchSigninError: (error: string) => createAction(types.SIGNIN_FETCH_ERROR, error),
  fetchSignupStart: () => createAction(types.SIGNUP_FETCH_START),
  fetchSignupSuccess: (user: any) => createAction(types.SIGNUP_FETCH_SUCCESS, user),
  fetchSignupError: (error: string) => createAction(types.SIGNUP_FETCH_ERROR, error),
  showMessageBarUI: (color: SemanticCOLORS, message: string) => createAction(types.UI_SHOW_MESSAGEBAR, { color, message }),
  clearMessageBarUI: () => createAction(types.UI_CLEAR_MESSAGEBAR),
};
