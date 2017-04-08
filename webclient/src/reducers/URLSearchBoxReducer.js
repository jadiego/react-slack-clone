export default function reducer(state = {
    results:[],
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    switch (action.type) {
        case 'FETCH_OGP':
            return {...state, fetching: true}
        case 'FETCH_OGP_REJECTED':
            return {...state, fetching:false, error: action.payload}
        case 'FETCH_OGP_FULFILLED':
            return {
                ...state,
                fetching: false,
                fetched: true,
                tweets: action.payload,
            }
    }
    return state
}
