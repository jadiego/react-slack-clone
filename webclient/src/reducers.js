import { remove, findIndex } from 'lodash';
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
        case "UPDATE USER":
            return { ...state, ...action.data }
        default:
            return state
    }
}

let users = (state = [], action) => {
    switch (action.type) {
        case "SET USERS":
            return action.data;
        case "USER NEW":
            return state.concat([action.data])
        default:
            return state
    }
}

let channels = (state = [], action) => {
    switch (action.type) {
        case "SET CHANNELS":
            return action.data;
        case "CHANNEL NEW":
            return state.concat([action.data])
        case "CHANNEL UPDATE":
            let channels = state.concat([])
            let i = findIndex(channels, (c) => { return c.id === action.data.id })
            channels[i] = action.data
            return channels
        case "CHANNEL DELETE":
            return remove(state, c => { return c.id !== action.channelid})
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
        case "USER JOINING CHANNEL":
            let x = {...state}
            x.members.push(action.data.id)
            return x
        default:
            return state
    }
}

let messages = (state = {}, action) => {
    switch (action.type) {
        case "SET MESSAGES":
            var x = { ...state }
            x[action.channelid] = action.data
            return x
        case "MESSAGE NEW":
            return { ...state, ...state[action.data.channelid].push(action.data) }
        case "MESSAGE UPDATE":
            var x = { ...state }
            var messages = x[action.data.channelid]
            var i = findIndex(messages, (m) => { return m.id === action.data.id })
            messages[i] = action.data
            x[action.data.channelid] = messages
            return x
        case "MESSAGE DELETE":
            var x = { ...state }
            var messages = x[action.channelid]
            var newmessages = remove(messages, m => { return m.id !== action.messageid })
            x[action.channelid] = newmessages
            return x
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