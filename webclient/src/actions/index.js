import 'whatwg-fetch'

let nextSearchResultID = 0

export function fetchURL(url) {
    return (dispatch) => {
        fetch('http://104.131.146.195/v1/summary?url' + url)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            dispatch({type: 'FETCH_OGP_FULFILLED', payload: data})
        })
        .catch((err) => {
            dispatch({type: 'FETCH_OGP_REJECTED', payload:err})
        })
    }
}

export const addSearchResult = (img, description, title) => {
    return {
        type: 'ADD_SEARCH_RESULT',
        id: nextSearchResultID++,
        img: img,
        description: description,
        title: title
    }
}