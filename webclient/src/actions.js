import _, { find } from 'lodash';

const headerContentType = "Content-Type"
const charsetUTF8 = "charset=utf-8"
const contentTypeText = "text/plain"
const contentTypeJSON = "application/json"
const contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
const contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
const storageKey = "auth"

export var apiRoot = "https://api.chat.jadiego.me/v1/";
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  apiRoot = "https://localhost:4000/v1/"
};

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

export const fetchSignUp = (e, u, fn, ln, p1, p2) => {
  e.preventDefault()

  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}users`, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": contentTypeJSONUTF8
      }),
      body: JSON.stringify({
        firstName: fn,
        lastName: ln,
        userName: u,
        password: p1,
        passwordConf: p2,
        email: e
      })
    })
      .then(resp => {
        localStorage.setItem(storageKey, resp.headers.get("Authorization"))
        return handleResponse(resp)
      })
      .then(data => {
        dispatch({ type: 'SET CURRENT USER', data })
        dispatch({ type: 'FETCH END', message: "" })
      })
      .catch(error => {
        dispatch({ type: 'FETCH END', message: error.message })
      })
  }
}

export const fetchAuthenticate = (event, email, password) => {
  event.preventDefault()

  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}sessions`, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": contentTypeJSONUTF8
      }),
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(resp => {
        localStorage.setItem(storageKey, resp.headers.get("Authorization"))
        return handleResponse(resp)
      })
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
        dispatch({ type: 'SET CURRENT USER', data })
      })
      .catch(error => {
        dispatch({ type: 'FETCH END', message: error.message })
      })
  }
}

export const fetchSignOut = () => {
  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}sessions/mine`, {
      method: "DELETE",
      mode: "cors",
      headers: new Headers({
        "Authorization": localStorage.getItem(storageKey)
      })
    })
      .then(handleResponse)
      .then(data => {
        localStorage.removeItem(storageKey)
        dispatch({ type: 'SET CURRENT USER', data: {} })
        dispatch({ type: 'FETCH END', message: data })

      })
      .catch(error => {
        dispatch({ type: 'FETCH END', message: error.message })

      })
  }
}

export const fetchCheckSession = () => {

  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}users/me`, {
      mode: "cors",
      headers: new Headers({
        "Authorization": localStorage.getItem(storageKey)
      })
    })
      .then(handleResponse)
      .then(data => {
        let message = ""
        dispatch({ type: 'FETCH END', message })
        dispatch({ type: 'SET CURRENT USER', data })

      })
      .catch(error => {
        localStorage.removeItem("auth")
        let message = error.message
        dispatch({ type: 'FETCH END', message })
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

export const fetchUsers = () => {
  return dispatch => {
    dispatch({ type: 'FETCH START' })

    return fetch(`${apiRoot}users`, {
      mode: "cors",
    })
      .then(handleResponse)
      .then(data => {
        dispatch({ type: 'FETCH END', message: "" })
        dispatch({ type: 'SET USERS', data })
      })
      .catch(error => {
        dispatch({ type: 'FETCH END', message: error.message })
      })
  }
}

export const fetchChannelMessages = (channelname) => {
  return (dispatch, getState) => {
    const { currentChannel, channels } = getState();
    let co = _.find(channels, (c) => {
      return c.name === channelname
    });

    dispatch({ type: 'SET CURRENT CHANNEL', data: co })
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

export const fetchLinkToChannel = (channelid) => {
  return dispatch => {
    return fetch(`${apiRoot}channels/${channelid}`, {
      method: "LINK",
      mode: "cors",
      headers: new Headers({
        "Authorization": localStorage.getItem(storageKey)
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

export const postMessage = (event) => {

  return (dispatch, getState) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
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
          dispatch({ type: 'MESSAGE NEW', data})
          dispatch({ type: 'UPDATE NEW MESSAGE', body: "" })
        })
        .catch(error => dispatch({ type: 'FETCH END', message: error.message }))
    }
  }
}