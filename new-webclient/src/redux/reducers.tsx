import { model, types } from ".";
import { combineReducers } from "redux";
import { Actions } from "./action-helper";

const fetching = (state = model.FetchInitialState, action: Actions): model.FetchState => {
  switch (action.type) {
    case types.SIGNIN_FETCH_START:
    case types.SIGNUP_FETCH_START:
    case types.SESSION_FETCH_START:
      return { count: state.count + 1 };

    case types.SIGNIN_FETCH_ERROR:
    case types.SIGNIN_FETCH_SUCCESS:
    case types.SIGNUP_FETCH_ERROR:
    case types.SIGNUP_FETCH_SUCCESS:
    case types.API_SERVER_DOWN_ERROR:
    case types.SESSION_FETCH_ERROR:
    case types.SESSION_FETCH_SUCCESS:
      return { count: state.count - 1 };

    default:
      return state;
  }
};

const messagebar = (state = model.MessageBarInitialState, action: Actions): model.MessageBarState => {
  switch (action.type) {
    case types.UI_CLEAR_MESSAGEBAR:
      return { visible: false };
    case types.UI_SHOW_MESSAGEBAR:
      return { visible: true, ...action.payload };
    case types.SIGNIN_FETCH_ERROR:
    case types.SIGNUP_FETCH_ERROR:
    case types.API_SERVER_DOWN_ERROR:
    case types.SESSION_FETCH_ERROR:
    case types.MESSAGES_FETCH_ERROR:
    case types.USERS_FETCH_ERROR:
    case types.CHANNELS_FETCH_ERROR:
    case types.POST_MESSAGE_ERROR:
      return { visible: true, color: "yellow", message: action.payload };
    case types.SIGNUP_FETCH_SUCCESS:
      return { visible: true, color: "green", message: "Account succesfully created" }; 
    default:
      return state;
  }
}

const users = (state = model.UsersInitialState, action: Actions): model.User[] => {
  switch (action.type) {
    case types.USERS_FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

const channels = (state = model.ChannelsInitialState, action: Actions): model.Channel[] => {
  switch (action.type) {
    case types.CHANNELS_FETCH_SUCCESS:
      return action.payload;
    case types.CHANNELS_CREATE_SUCCESS:
      return [ ...state, ...[action.payload] ];
    case types.DELETE_CHANNEL_SUCCESS:
      let chans = state.slice()
      return chans.filter(chan => chan.id !== action.payload);
    default:
      return state;
  }
}

const currentUser = (state = null, action: Actions): model.User | null => {
  switch (action.type) {
    case types.SESSION_FETCH_SUCCESS:
      return action.payload;
    case types.SIGNIN_FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

const currentChannel = (state = null, action: Actions): model.Channel | null => {
  switch (action.type) {
    case types.SET_CURRENT_CHANNEL:
      return action.payload;
    default:
      return state;
  }
}

const messages = (state = model.MessagesInitialState, action: Actions): model.Message[] => {
  switch (action.type) {
    case types.MESSAGES_FETCH_START:
      return [];
    case types.MESSAGES_FETCH_SUCCESS:
      return action.payload;
    case types.POST_MESSAGE_SUCCESS:
      return [ ...state, action.payload ];
    default:
      return state;
  }
}

const reducer = combineReducers<model.StoreState>({
  fetching,
  currentUser,
  currentChannel,
  users,
  channels,
  messagebar,
  messages,
});

export default reducer;
