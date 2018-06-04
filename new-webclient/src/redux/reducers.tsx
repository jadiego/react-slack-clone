import * as types from "./types";
import { combineReducers } from "redux";
import { Actions } from "./action-helper";

const fetching = (state: types.FetchState = { fetch: "", count: 0 }, action: Actions) => {
  switch (action.type) {
    case types.FETCH_START:
      return { count: state.count + 1, fetch: action.type };
    case types.FETCH_END:
      return { count: state.count - 1, fetch: action.type };
    default:
      return state;
  }
};

const reducer = combineReducers({
  fetching
});

export default reducer;
