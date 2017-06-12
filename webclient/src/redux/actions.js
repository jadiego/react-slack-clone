import { find, isEqual, includes } from 'lodash';
import axios from 'axios';
import NProgress from 'nprogress';

const headerContentType = "Content-Type"
const charsetUTF8 = "charset=utf-8"
const contentTypeText = "text/plain"
const contentTypeJSON = "application/json"
const contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
const contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
const storageKey = "auth"

const newChannel = "new channel"
const newUser = "new user"
const newMessage = "new message"
const updatedChannel = "updated channel"
const updatedMessage = "updated message"
const deletedChannel = "deleted channel"
const deletedMessage = "deleted message"
const userJoinedChannel = "user joined channel"
const userLeftChannel = "user left channel"

export var apiRoot = "https://api.chat.jadiego.me/v1/";
var apiWS = "wss://api.chat.jadiego.me/v1/websocket"
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//   apiRoot = "https://localhost:4000/v1/"
//   apiWS = "wss://localhost:4000/v1/websocket"
// };

//config axios
axios.defaults.baseURL = apiRoot;
axios.defaults.headers.common['Authorization'] = localStorage.getItem(storageKey);


//Handler for fetch calls that either calls handleJSONResponse or handleTextresponse
//depending on the response from fetch call
export const handleResponse = (response) => {
  let contentType = response.headers.get(headerContentType)
  if (contentType.includes(contentTypeJSON)) {
    return handleJSONResponse(response)
  } else if (contentType.includes(contentTypeText)) {
    return handleTextResponse(response)
  } else {
    //For other response types besides JSON and text
    throw new Error(`Sorry, content-type ${contentType} not yet supported`)
  }
}
//Handler for JSON response fetch calls
export const handleJSONResponse = (response) => {
  return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(Object.assign({}, json, {
          status: response.status,
          statusText: response.statusText
        }))
      }
    })
}
//Handler for Text response fetch calls
export const handleTextResponse = (response) => {
  return response.text()
    .then(text => {
      if (response.ok) {
        return text
      } else {
        return Promise.reject({
          status: response.status,
          message: text,
        })
      }
    })
}

export const fetchSignUp = (modal, e, u, fn, ln, p1, p2) => {
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

export const fetchAuthenticate = (modal, email, password) => {
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
        localStorage.setItem(storageKey, data.headers.authorization)
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

export const fetchSignOut = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'sign out' } })
    return axios({
      url: 'sessions/mine',
      method: 'delete',
      headers: localStorage.getItem(storageKey)
    })
      .then(resp => {
        NProgress.done();
        localStorage.removeItem(storageKey)
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CURRENT USER', payload: resp.data })
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

//doesnt do the whole fetch start, fetch end dispatch
//because it doesn't need to be recorded.
export const fetchCheckSession = () => {
  NProgress.start();
  return dispatch => {
    dispatch({ type: 'FETCH START', payload: { fetch: 'check session' } })
    return axios({
      url: 'users/me',
      method: 'get',
      headers: localStorage.getItem(storageKey)
    })
      .then(resp => {
        NProgress.done();
        localStorage.removeItem(storageKey)
        dispatch({ type: 'FETCH END', payload: { fetch: '', data: '' } })
        dispatch({ type: 'SET CURRENT USER', payload: resp.data })
        return resp;
      })
      .catch(error => {
        NProgress.done();
        if (error.response) {
          localStorage.clear()
          dispatch({ type: 'FETCH END', payload: { ...error.response, fetch: 'check session' } })
        }
      })
  }
}

export const fetchChannels = () => {
  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}channels`, {
      mode: "cors",
      headers: new Headers({
        "Authorization": localStorage.getItem(storageKey)
      })
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
        dispatch({ type: 'SET CHANNELS', data })
      })
      .catch(error => {
        dispatch({ type: 'FETCH END', message: error.message })
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

export const fetchChannelMessages = (channelname, username, userid) => {
  return (dispatch, getState) => {
    const { currentChannel, channels, currentUser, messages } = getState();
    //check first if the username parameter was given, if it was given that
    //means that the channel we are looking for is a direct DM channel
    if (username === undefined) {
      var co = find(channels, (c) => {
        return c.name === channelname
      });
    } else {
      var co = find(channels, (c) => {
        let channelname = [username, currentUser.userName].sort()
        let grabbedchannel = c.name.split(":").sort()
        return isEqual(channelname, grabbedchannel)
      })
    }
    //co is the result of finding it whitin the current channels state.
    //if its undefined, meaning it's not in the channels state, then we need to
    //create it
    if (co === undefined) {
      //set the necessary parameters to create a private DM channel
      let channelname = [username, currentUser.userName].sort().join(":")
      let privatechan = true
      let description = `Direct messsages between you and ${username}`
      //special case:
      //if the user prompt is the current user, then leave members list empty,
      //server side will automatically add in creator
      if (username === currentUser.userName) {
        var members = []
      } else {
        var members = [userid, currentUser.id]
      }
      console.log("creating channel")
      //create the channel and sets the channel
      return dispatch(fetchCreateChannel(channelname, privatechan, description, members))
    } else {
      //set the current channel found within the channels state object
      dispatch({ type: 'SET CURRENT CHANNEL', data: co })
      fetchLinkToChannel(co.id)


      //next we check if we already have the messages pulled form the database
      //if 'messages[co.id]', or messages.<channel-id>, is undefined, then we
      //don't have the messages yet. If it's defined, then we don't need to do anything
      if (messages[co.id] === undefined) {
        dispatch({ type: 'FETCH START' })
        return fetch(`${apiRoot}channels/${co.id}`, {
          mode: "cors",
          headers: new Headers({
            "Authorization": localStorage.getItem(storageKey)
          })
        })
          .then(handleResponse)
          .then(data => {
            dispatch({ type: 'FETCH END', message: "" })
            dispatch({ type: 'SET MESSAGES', data, channelid: co.id })
          })
          .catch(error => {
            dispatch({ type: 'FETCH END', message: error.message })
          })
      }
    }
  }
}

export const fetchLinkToChannel = (channelid) => {
  return dispatch => {

    return fetch(`${apiRoot}channels/${channelid}`, {
      method: "LINK",
      mode: "cors",
      headers: new Headers({
        "Authorization": localStorage.getItem(storageKey),
        "Link": channelid
      })
    })
      .then(handleResponse)
      .then(data => {
      })
      .catch(error => console.log("error: ", error))
  }
}

export const changeTextArea = (event) => {
  event.preventDefault()
  return dispatch => {
    dispatch({ type: 'UPDATE NEW MESSAGE', body: event.target.value })
  }
}

export const postMessage = (event, messagepage) => {

  return (dispatch, getState) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault()
      const { currentChannel, newMessage } = getState()

      dispatch({ type: 'FETCH START' })
      return fetch(`${apiRoot}messages`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
          "Content-Type": contentTypeJSONUTF8,
          "Authorization": localStorage.getItem(storageKey)
        }),
        body: JSON.stringify({
          channelid: currentChannel.id,
          body: newMessage
        })
      })
        .then(handleResponse)
        .then(data => {
          dispatch({ type: 'FETCH END', message: "" })
          dispatch({ type: 'UPDATE NEW MESSAGE', body: "" })
        })
        .then(resp => {
          if (newMessage.includes("@chatbot")) {
            queryChatBot(dispatch, currentChannel, newMessage)
          }
        })
        .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
    }
  }
}

export const queryChatBot = (dispatch, currentChannel, newMessage) => {
  dispatch({ type: 'FETCH START' })
  return fetch(`${apiRoot}bot?q=${newMessage.split("@chatbot ")[1]}`, {
    method: "POST",
    mode: "cors",
    headers: new Headers({
      "Authorization": localStorage.getItem(storageKey)
    }),
  })
    .then(handleResponse)
    .then(data => {
      dispatch({ type: 'FETCH END', message: "" })
      return data
    })
    .then(chatbotanswer => {
      dispatch({ type: 'FETCH START' })
      return fetch(`${apiRoot}messages`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
          "Content-Type": contentTypeJSONUTF8,
          "Authorization": localStorage.getItem(storageKey)
        }),
        body: JSON.stringify({
          channelid: currentChannel.id,
          body: chatbotanswer
        })
      })
        .then(handleResponse)
        .then(data => {
          dispatch({ type: 'FETCH END', message: "" })
        })
    })
    .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
}

export const fetchCreateChannel = (channelname, privatechan, description, members) => {
  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}channels`, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": contentTypeJSONUTF8,
        "Authorization": localStorage.getItem(storageKey)
      }),
      body: JSON.stringify({
        name: channelname,
        description: description,
        members: members,
        private: privatechan
      })
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
        dispatch({ type: 'SET MESSAGES', data: [], channelid: data.id })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
  }
}

export const fetchUpdateCurrentUser = (event, fn, ln) => {
  event.preventDefault()

  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}users/me`, {
      method: 'PATCH',
      mode: "cors",
      headers: {
        "Content-Type": contentTypeJSONUTF8,
        "Authorization": localStorage.getItem(storageKey)
      },
      body: JSON.stringify({
        firstName: fn,
        lastName: ln
      })
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: `${data} Please logout and login again to reflect changes.` })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))

  }
}

export const fetchDeleteMessage = (modal, messageid) => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}messages/${messageid}`, {
      method: 'DELETE',
      mode: "cors",
      headers: {
        "Authorization": localStorage.getItem(storageKey)
      },
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
  }
}

export const fetchDeleteChannel = (modal, channelid) => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}channels/${channelid}`, {
      method: 'DELETE',
      mode: "cors",
      headers: {
        "Authorization": localStorage.getItem(storageKey)
      },
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
  }
}

export const fetchEditMessage = (modal, messageid, body) => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}messages/${messageid}`, {
      method: 'PATCH',
      headers: {
        "Authorization": localStorage.getItem(storageKey),
        "Content-Type": contentTypeJSONUTF8
      },
      body: JSON.stringify({
        body: body
      })
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
  }
}

export const fetchEditChannel = (modal, channelid, name, description) => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}channels/${channelid}`, {
      method: 'PATCH',
      headers: {
        "Authorization": localStorage.getItem(storageKey),
        "Content-Type": contentTypeJSONUTF8
      },
      body: JSON.stringify({
        name: name,
        description: description
      })
    })
      .then(handleResponse)
      .then(data => {
        modal.setState({ visible: false })
        dispatch({ type: 'FETCH END', message: "" })
      })
      .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
  }
}

export const initiateWebSocketConnection = () => {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    var websock = new WebSocket(`${apiWS}?auth=${localStorage.getItem(storageKey)}`)
    websock.addEventListener("message", (wsevent) => {
      var event = JSON.parse(wsevent.data)
      switch (event.type) {
        case newMessage:
          dispatch({ type: 'MESSAGE NEW', data: JSON.parse(event.message) })
          break
        case newChannel:
          var ch = JSON.parse(event.message)
          if ((includes(ch.members, currentUser.id) || !ch.private)) {
            dispatch({ type: 'CHANNEL NEW', data: ch })
          }
          if (ch.creatorid === currentUser.id) {
            dispatch({ type: 'SET CURRENT CHANNEL ', data: ch })
          }
          break
        case deletedMessage:
          var { currentChannel } = getState()
          var message = JSON.parse(event.message)
          if ((includes(currentChannel.members, currentUser.id))) {
            dispatch({ type: 'MESSAGE DELETE', messageid: message.id, channelid: message.channelid })
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
          if ((includes(ch.members, currentUser.id))) {
            dispatch({ type: 'CHANNEL DELETE', channelid: ch.id, channel: ch })
          }
          var { currentChannel } = getState()
          if (currentChannel.id === ch.id) {
            if (currentChannel.creatorid !== currentUser.id) {
              window.alert("Warning! the creator deleted the channel just recently. We will go ahead and redirect you to the general channel. Apologies for the inconvenience.")
            }
            location.reload(`${location.origin}/messages/general`)
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
