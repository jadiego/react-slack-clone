import { find, isEqual, includes } from 'lodash';
import axios from 'axios';
import NProgress from 'nprogress';

const storageKey = "auth";

// const newChannel = "new channel"
// const newUser = "new user"
// const newMessage = "new message"
// const updatedChannel = "updated channel"
// const updatedMessage = "updated message"
// const deletedChannel = "deleted channel"
// const deletedMessage = "deleted message"
// const userJoinedChannel = "user joined channel"
// const userLeftChannel = "user left channel"

export var apiRoot = "https://api.chat.jadiego.me/v1/";
var apiWS = "wss://api.chat.jadiego.me/v1/websocket"
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

//config axios
axios.defaults.baseURL = apiRoot;
axios.interceptors.request.use(config => {
  config.headers = { 'Authorization': getSessionKey() }
  return config;
})

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
        dispatch({ type: 'SET CURRENT USER', payload: {} })
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
    const { channels } = getState();
    if (channelname === null || channelname === undefined) {
      dispatch({ type: 'SET CURRENT CHANNEL', payload: {} });
      return '';
    }
    let channel = find(channels, ch => ch.name === channelname);
    dispatch({ type: 'SET CURRENT CHANNEL', payload: channel });
    return channel;
  }
}

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

export const postMessage = (body) => {
  return (dispatch, getState) => {
    const { currentChannel } = getState();
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
        dispatch({ type: 'MESSAGE NEW', payload: resp.data })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'post new message' } })
        }
        return error;
      });
  }
}

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
        dispatch({ type: 'CHANNEL NEW', payload: resp.data })
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
