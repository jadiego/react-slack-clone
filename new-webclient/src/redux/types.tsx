import { SemanticCOLORS } from "semantic-ui-react";

export interface StoreState {
  fetching: FetchState;
  messagebar: MessageBarState;
}

export interface FetchState {
  count: number;
}
export const FetchInitialState = { count: 0 };

export interface MessageBarState {
  visible: boolean;
  color?: SemanticCOLORS;
  message?: string;
}
export const MessageBarInitialState = {
    visible: false,
}

export const SIGNIN_FETCH_START = "signin/FETCH_START";
export const SIGNIN_FETCH_SUCCESS = "signin/FETCH_SUCCESS";
export const SIGNIN_FETCH_ERROR = "signin/FETCH_ERROR";

export const SIGNUP_FETCH_START = "signup/FETCH_START";
export const SIGNUP_FETCH_SUCCESS = "signup/FETCH_SUCCESS";
export const SIGNUP_FETCH_ERROR = "signup/FETCH_ERROR";

export const UI_SHOW_MESSAGEBAR = "ui/SHOW_MESSAGEBAR";
export const UI_CLEAR_MESSAGEBAR = "ui/CLEAR_MESSAGEBAR";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export interface SignupFormArgs {
  email: string;
  username: string,
  firstname: string,
  lastname: string,
  password: string,
  passwordconf: string
}