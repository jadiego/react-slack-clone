import { combineReducers } from 'redux';

let fetching = (state = 0, action) => {
    switch (action.type) {
        case "FETCH START":
            return state + 1;
        case "FETCH END":
            return state - 1;
        default:
            return state
    }
}

let fetchError = (state = "", action) => {
    switch (action.type) {
        case "FETCH END":
            return action.message
        default:
            return state
    }
}

let currentUser = (state = {}, action) => {
    switch (action.type) {
        case "SET CURRENT USER":
            return action.data;
        default:
            return state
    }
}

let users = (state = [], action) => {
    switch (action.type) {
        case "SET USERS":
            return action.data;
        default:
            return state
    }
}

let channels = (state = [], action) => {
    switch (action.type) {
        case "SET CHANNELS":
            return action.data;
        default:
            return state
    }
}

let currentChannel = (state = {}, action) => {
    switch (action.type) {
        case "SET CURRENT CHANNEL":
            if (action.data === undefined) {
                return state
            }
            return action.data;
        default:
            return state
    }
}

let messages = (state = {}, action) => {
    switch (action.type) {
        case "SET MESSAGES":
            var obj = Object.assign({}, { ...state })
            obj[action.channelid] = action.data
            return obj;
        case "MESSAGE NEW":
            var obj = Object.assign({}, { ...state })
            obj[action.data.channelid].push(action.data)
            return obj
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
})

export default rootReducer