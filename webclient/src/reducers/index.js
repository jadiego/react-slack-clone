import { combineReducers } from 'redux'

import searchbox from './URLSearchBoxReducer'
import searchresults from  './SearchResultsFilterReducer'

export default combineReducers({
    searchbox,
    searchresults,
})
