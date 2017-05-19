import 'whatwg-fetch';

const headerContentType = "Content-Type"
const charsetUTF8         = "charset=utf-8"
const contentTypeText     = "text/plain"
const contentTypeJSON     = "application/json"
const contentTypeJSONUTF8 = contentTypeJSON + "; " + charsetUTF8
const contentTypeTextUTF8 = contentTypeText + "; " + charsetUTF8
export const storageKey = "auth"

//default base API URL to production
export var apiRoot = "https://api.chat.jadiego.me/v1/";

//if our site is being served from localhost,
//or the loop-back address, switch the base API URL
//to localhost as well
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
                    statusText: response.statusText,
                    err: text
                })
            }
        })
}

export const Auth = {
    authenticate(f, e, p) {
        f.setState({ loading: true, error: false })
        fetch(`${apiRoot}sessions`, {
            method: "POST",
            mode: "cors",
            headers: new Headers({
                "Content-Type": contentTypeJSONUTF8
            }),
            body: JSON.stringify({
                email: e,
                password: p
            })
        })
            .then(resp => {
                localStorage.setItem(storageKey, resp.headers.get("Authorization"))
                return handleResponse(resp)
            })
            .then(data => {
                f.setState({ loading: false })
                localStorage.setItem("u", JSON.stringify(data))
                f.props.history.push('/messages')
            })
            .catch(error => {
                f.setState({ loading: false, error: true, errmsg: error.err })
            })
    },
    signout(p) {
        fetch(`${apiRoot}sessions/mine`, {
            method: "DELETE",
            mode: "cors",
            headers: new Headers({
                "Authorization": localStorage.getItem(storageKey)
            })
        })
            .then(handleResponse)
            .then(data => {
                localStorage.removeItem(storageKey)
                localStorage.removeItem("u")
                 p.props.history.push('/')
                 console.log(data)
            })
            .catch(error => {
                console.log(error)
            })
    },
    signup(f, e, u, fn, ln, p1, p2) {
        f.setState({ loading: true, error: false })

        fetch(`${apiRoot}users`, {
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
                f.setState({ loading: false })
                localStorage.setItem("u", JSON.stringify(data))
                f.props.history.push('/messages')
            })
            .catch(error => {
                f.setState({ loading: false, error: true, errmsg: error.err })
                console.log(error)
            })
    }
}
