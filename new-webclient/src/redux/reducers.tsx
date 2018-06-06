import * as types from "./types";
import { combineReducers } from "redux";
import { Actions } from "./action-helper";

const fetching = (state = types.FetchInitialState, action: Actions): types.FetchState => {
  switch (action.type) {
    case types.SIGNIN_FETCH_START:
    case types.SIGNUP_FETCH_START:
      return { count: state.count + 1 };

    case types.SIGNIN_FETCH_ERROR:
    case types.SIGNIN_FETCH_SUCCESS:
    case types.SIGNUP_FETCH_ERROR:
    case types.SIGNUP_FETCH_SUCCESS:
      return { count: state.count - 1 };

    default:
      return state;
  }
};

const messagebar = (state = types.MessageBarInitialState, action: Actions): types.MessageBarState => {
  switch (action.type) {
    case types.UI_CLEAR_MESSAGEBAR:
      return { visible: false };
    case types.UI_SHOW_MESSAGEBAR:
      return { visible: true, ...action.payload };
    case types.SIGNIN_FETCH_ERROR:
    case types.SIGNUP_FETCH_ERROR:
      return { visible: true, color: "yellow", message: action.payload };
    case types.SIGNUP_FETCH_SUCCESS:
      return { visible: true, color: "green", message: "Account succesfully created" }; 
    default:
      return state;
  }
}

const reducer = combineReducers<types.StoreState>({
  fetching,
  messagebar,
});

export default reducer;
