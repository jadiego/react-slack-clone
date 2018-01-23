import { find, isEqual, includes } from 'lodash';
import axios from 'axios';
import NProgress from 'nprogress';

const storageKey = "auth";

const newChannel = "new channel"
const newUser = "new user"
const newMessage = "new message"
const updatedChannel = "updated channel"
const updatedMessage = "updated message"
const deletedChannel = "deleted channel"
const deletedMessage = "deleted message"
const userJoinedChannel = "user joined channel"
const userLeftChannel = "user left channel"

export var apiRoot = "https://api.howl.jadiego.me/v1/";
var apiWS = "wss://api.howl.jadiego.me/v1/websocket"
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  apiRoot = "https://localhost:4000/v1/"
  apiWS = "wss://localhost:4000/v1/websocket"
};


export const getSessionKey = () => {
  return localStorage.getItem(storageKey);
}

const setSessionKey = (v) => {
  localStorage.setItem(storageKey, v);
}

const removeSessionKey = () => {
  return localStorage.removeItem(storageKey);
}

export const createDMChannelname = (name1, name2) => {
  return [name1, name2].sort().join(':');
}

export const getChannelFromURL = (props) => {
  return props.location.pathname.split("/")[2];
}

//config axios
axios.defaults.baseURL = apiRoot;
axios.interceptors.request.use(config => {
  config.headers = { 'Authorization': getSessionKey() }
  return config;
})

// POST /v1/users
export const signup = (modal, e, u, fn, ln, p1, p2) => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'sign up' } })
    return axios({
      url: 'users',
      method: 'post',
      data: {
        firstName: fn,
        lastName: ln,
        userName: u,
        password: p1,
        passwordConf: p2,
        email: e
      },
      headers: localStorage.getItem(storageKey)
    })
      .then(resp => {
        NProgress.done();
        modal.setState({ visible: false })
        localStorage.setItem(storageKey, resp.headers.authorization)
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CURRENT USER', payload: resp.data })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'sign up' } })
        }
        return error;
      });
  }
}

// POST /v1/sessions
export const signin = (modal, email, password) => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'sign in' } })
    return axios({
      url: 'sessions',
      method: 'post',
      data: {
        email,
        password,
      }
    })
      .then(data => {
        NProgress.done();
        modal.setState({ visible: false })
        setSessionKey(data.headers.authorization)
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CURRENT USER', payload: data.data })
        return data;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'sign in' } })
        }
        return error;
      });
  }
}

// DELETE /v1/sessions/mine
export const signout = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'sign out' } })
    return axios({
      url: 'sessions/mine',
      method: 'delete'
    })
      .then(resp => {
        NProgress.done();
        removeSessionKey()
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SIGN OUT' })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'sign out' } })
        }
        return error;
      })
  }
}

// GET /v1/users/me
export const checkSession = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'check session' } })
    return axios({
      url: 'users/me',
      method: 'get'
    })
      .then(resp => {
        NProgress.done();
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CURRENT USER', payload: resp.data })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          removeSessionKey()
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'check session' } })
        }
        return error;
      })
  }
}

// GET /v1/users
//get an array of all signed-up users from the api server.
export const getUsers = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'get users' } })
    return axios({
      url: 'users',
      method: 'get'
    })
      .then(resp => {
        NProgress.done();
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET USERS', payload: resp.data })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'get users' } })
        }
        return error;
      });
  }
}

// GET /v1/channels
export const getChannels = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'get channels' } })
    return axios({
      url: 'channels',
      method: 'get'
    })
      .then(resp => {
        NProgress.done();
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CHANNELS', payload: resp.data })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'get channels' } })
        }
      });
  }
}

export const setCurrentChannel = (channelname) => {
  return (dispatch, getState) => {
    const { channels, currentUser } = getState();
    if (channelname === null || channelname === undefined) {
      dispatch({ type: 'SET CURRENT CHANNEL', payload: {} });
      return '';
    }
    let channel = find(channels, ch => ch.name === channelname);
    dispatch({ type: 'SET CURRENT CHANNEL', payload: channel });
    joinToChannel(dispatch, channel, currentUser);
    return channel;
  }
}

// POST /v1/channels
export const createChannel = (name, description, isPrivate, members) => {
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'create new channel' } })
    return axios({
      url: `channels`,
      method: 'post',
      data: {
        name: name,
        private: isPrivate,
        members,
        description,
      }
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'create new channel' } })
        }
        return error;
      });
  }
}

export const joinToChannel = (dispatch, channel, currentUser) => {
  if (!includes(channel.members, currentUser.id)) {
    dispatch({ type: 'FETCH START', payload: { fetch: 'user joining messages' } })
    return axios({
      url: `channels/${channel.id}`,
      method: 'link'
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'USER JOINING CHANNEL', payload: currentUser.id })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'user joining messages' } })
        }
        return error;
      });
  }
}

// GET /v1/channels/<channel-id>
export const getChannelMessages = () => {
  NProgress.start();
  return (dispatch, getState) => {
    const { currentChannel } = getState();
    dispatch({ type: 'FETCH START', payload: { fetch: 'get channel messages' } })
    return axios({
      url: `channels/${currentChannel.id}`,
      method: 'get'
    })
      .then(resp => {
        NProgress.done();
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET MESSAGES', payload: { messages: resp.data, channelid: currentChannel.id } })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'get channel messages' } })
        }
        return error;
      });
  }
}

// POST  to either /v1/messages or /v1/bot
// depending if the body of text starts with '@chatbot' or not.
export const postMessage = (body) => {
  return (dispatch, getState) => {
    const { currentChannel, currentUser } = getState();
    if (body !== "" && body.startsWith("@chatbot")) {
      let searchQuery = body.split("@chatbot ")[1];
      return queryChatBot(dispatch, currentChannel, currentUser, searchQuery);
    } else {
      return postMessageToChannel(dispatch, currentChannel, body);
    }

  }
}

// POST to /v1/bot
export const queryChatBot = (dispatch, currentChannel, currentUser, body) => {
  dispatch({ type: 'FETCH START', payload: { fetch: 'query chatbot' } })
  return axios({
    url: `bot?q=${body}`,
    method: 'post',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
    .then(resp => {
      dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
      let data = {
        channelid: currentChannel.id,
        creatorid: currentUser.id,
        body: `"${body}": ${resp.data}`,
      }
      dispatch({ type: 'QUERY CHATBOT', payload: data})
      return resp;
    })
    .catch(error => {
      if (error.response) {
        dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'query chatbot' } })
      }
      return error;
    });
}

// POST to /v1/messages
const postMessageToChannel = (dispatch, currentChannel, body) => {
  dispatch({ type: 'FETCH START', payload: { fetch: 'post new message' } })
  return axios({
    url: `messages`,
    method: 'post',
    data: {
      channelid: currentChannel.id,
      body,
    }
  })
    .then(resp => {
      dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
      return resp;
    })
    .catch(error => {
      if (error.response) {
        dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'post new message' } })
      }
      return error;
    });
}

// DELETE /v1/messages/<message-id>
export const deleteMessage = (message) => {
  return (dispatch, getState) => {
    const { currentChannel } = getState();
    dispatch({ type: 'FETCH START', payload: { fetch: 'delete message' } })
    return axios({
      url: `messages/${message.id}`,
      method: 'delete'
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'delete message' } })
        }
        return error;
      });
  }
}

// PATCH /v1/messages/<message-id>
export const editMessage = (newBody, message) => {
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'edit message' } })
    return axios({
      url: `messages/${message.id}`,
      method: 'patch',
      data: {
        body: newBody
      }
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'MESSAGE UPDATE', payload: resp.data })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'edit message' } })
        }
        return error;
      });
  }
}

// PATCH /v1/channels/<channel-id>
export const editChannel = (name, description) => {
  return (dispatch, getState) => {
    const { currentChannel } = getState();
    dispatch({ type: 'FETCH START', payload: { fetch: 'edit channel' } })
    return axios({
      url: `channels/${currentChannel.id}`,
      method: 'patch',
      data: {
        name,
        description,
      }
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'CHANNEL UPDATE', payload: resp.data })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'edit channel' } })
        }
        return error;
      });
  }
}

// DELETE /v1/channels/<channel-id>
export const deleteChannel = () => {
  return (dispatch, getState) => {
    const { currentChannel } = getState();
    dispatch({ type: 'FETCH START', payload: { fetch: 'delete channel' } })
    return axios({
      url: `channels/${currentChannel.id}`,
      method: 'delete',
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'delete channel' } })
        }
        return error;
      });
  }
}

// /v1/websocket
export const initiateWebSocketConnection = () => {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    var websock = new WebSocket(`${apiWS}?auth=${getSessionKey()}`)
    websock.addEventListener("message", (wsevent) => {
      var event = JSON.parse(wsevent.data)
      switch (event.type) {
        case newMessage:
          var { currentChannel } = getState()
          var message = JSON.parse(event.message);
          if (currentChannel.id === message.channelid) {
            console.log(message);
            dispatch({ type: 'MESSAGE NEW', payload: message })
          }
          break
        case newChannel:
          var ch = JSON.parse(event.message)
          if ((includes(ch.members, currentUser.id) || !ch.private)) {
            dispatch({ type: 'CHANNEL NEW', payload: ch })
          }
          break
        case deletedMessage:
          var { currentChannel } = getState()
          var message = JSON.parse(event.message)
          if (currentChannel.id === message.channelid) {
            dispatch({ type: 'MESSAGE DELETE', payload: message })
          }
          break
        case updatedMessage:
          var { currentChannel } = getState()
          var message = JSON.parse(event.message)
          if ((includes(currentChannel.members, currentUser.id))) {
            dispatch({ type: 'MESSAGE UPDATE', data: message })
          }
          break
        case deletedChannel:
          var ch = JSON.parse(event.message)
          if (includes(ch.members, currentUser.id)) {
            dispatch({ type: 'CHANNEL DELETE', payload: { id: ch.id } })
          }
          var { currentChannel } = getState()
          if (currentChannel.id === ch.id) {
            if (currentChannel.creatorid !== currentUser.id) {
              window.alert("Warning! the creator deleted the channel just recently. We will go ahead and redirect you to the general channel. Apologies for the inconvenience.")
            }
          }
          break
        case updatedChannel:
          var ch = JSON.parse(event.message)
          if ((includes(ch.members, currentUser.id))) {
            dispatch({ type: 'CHANNEL UPDATE', data: ch })
          }
          break
        case newUser:
          var u = JSON.parse(event.message)
          if (currentUser.id != u.id) {
            dispatch({ type: 'USER NEW', data: u })
          }
          break
        case userJoinedChannel:
          var u = JSON.parse(event.message)
          var { currentChannel } = getState()
          if ((!includes(currentChannel.members, u.id))) {
            dispatch({ type: 'USER JOINING CHANNEL', data: u })
          }
          break
      }
    })
  }
}
