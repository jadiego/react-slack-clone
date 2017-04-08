export default function reducer(state = {
    results:[],
    fetching: false,
    fetched: false,
    error: null,
}, action) {
    
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
};
