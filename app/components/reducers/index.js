import { combineReducers } from 'redux';

import data from '../active/reducer';

const rootReducer = combineReducers({
    reduxData: data,

});

export default rootReducer;
