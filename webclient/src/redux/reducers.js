import { remove, findIndex } from 'lodash';
import { combineReducers } from 'redux';

let fetching = (state = { fetch: "", count: 0 }, action) => {
    switch (action.type) {
        case "FETCH START":
            return { count: state.count + 1, fetch: action.payload.fetch };
        case "FETCH END":
            return { count: state.count - 1, fetch: action.payload.fetch };
        default:
            return state;
    }
}

let fetchError = (state = "", action) => {
    switch (action.type) {
        case "FETCH END":
            return action.payload.data;
        default:
            return state;
    }
}

let currentUser = (state = {}, action) => {
    switch (action.type) {
        case "SIGN OUT":
            return {};
        case "SET CURRENT USER":
            return action.payload;
        case "UPDATE USER":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

let users = (state = [], action) => {
    switch (action.type) {
        case "SIGN OUT":
            return [];
        case "SET USERS":
            return action.payload;
        case "USER NEW":
            return state.concat([action.data]);
        default:
            return state;
    }
}

let channels = (state = [], action) => {
    switch (action.type) {
        case "SIGN OUT":
            return [];
        case "SET CHANNELS":
            return action.payload;
        case "CHANNEL NEW":
            return state.concat([action.payload]);
        case "CHANNEL UPDATE":
            let channels = state.concat([]);
            let i = findIndex(channels, (c) => { return c.id === action.payload.id });
            channels[i] = action.payload;
            return channels;
        case "CHANNEL DELETE":
            return remove(state, c => { return c.id !== action.payload.id });
        default:
            return state;
    }
}

let currentChannel = (state = {}, action) => {
    switch (action.type) {
        case "SIGN OUT":
            return {};
        case "CHANNEL UPDATE":
            if (action.payload.id === state.id) {
                return action.payload;
            }
            return state;
        case "SET CURRENT CHANNEL":
            if (action.payload === undefined) {
                return state;
            }
            return action.payload;
        case "USER JOINING CHANNEL":
            let x = { ...state };
            x.members.push(action.payload);
            return x;
        default:
            return state;
    }
}

let messages = (state = {}, action) => {
    switch (action.type) {
        case "SET MESSAGES":
            var x = { ...state };
            x[action.payload.channelid] = action.payload.messages;
            return x;
        case "MESSAGE NEW":
            return { ...state, ...state[action.payload.channelid].push(action.payload) };
        case "MESSAGE UPDATE":
            var x = { ...state };
            var messages = x[action.payload.channelid];
            var i = findIndex(messages, (m) => { return m.id === action.payload.id });
            messages[i] = action.payload;
            x[action.payload.channelid] = messages;
            return x;
        case "MESSAGE DELETE":
            var x = { ...state }
            var messages = x[action.payload.channelid]
            var newmessages = remove(messages, m => { return m.id !== action.payload.id })
            x[action.payload.channelid] = newmessages
            return x;
        default:
            return state
    }
}

let sidebar = (state = { activeMenu: "channels", visible: true }, action) => {
    switch (action.type) {
        case "UPDATE ACTIVE SIDEBAR":
            return { ...state, activeMenu: action.payload }
        case "UPDATE VISIBLE SIDEBAR":
            return { ...state, visible: action.payload }
        default:
            return state
    }
}

let newMessage = (state = "", action) => {
    switch (action.type) {
        case "UPDATE NEW MESSAGE":
            return action.body
        default:
            return state
    }
}

const rootReducer = combineReducers({
    fetching,
    fetchError,
    currentUser,
    users,
    channels,
    currentChannel,
    messages,
    newMessage,
    sidebar,
})

export default rootReducer