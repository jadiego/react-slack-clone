// import { find, isEqual, includes } from 'lodash';
import axios from 'axios';
import NProgress from 'nprogress';

const storageKey = "auth"

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

const getSessionKey = () => {
  return localStorage.getItem(storageKey);
}

const setSessionKey = (v) => {
  localStorage.setItem(storageKey, v);
}

const removeSessionKey = () => {
  return localStorage.removeItem(storageKey);
}

//config axios
axios.defaults.baseURL = apiRoot;
axios.interceptors.request.use(config => {
  config.headers = {'Authorization': getSessionKey()}
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
      })
  }
}

//get an array of all signed-up users from the api server.
export const getUsers = () => {
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'get users' } })
    return axios({
      url: 'users',
      method: 'get'
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET USERS', payload: resp.data })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'get users' } })
        }
      });
  }
}

export const getChannels = () => {
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'get channels' } })
    return axios({
      url: 'channels',
      method: 'get'
    })
      .then(resp => {
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CHANNELS', payload: resp.data })
        return resp;
      })
      .catch(error => {
        if (error.response) {
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'get channels' } })
        }
      });
  }
}
