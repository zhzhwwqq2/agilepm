import * as types from '../actions/actionTypes';
const initialState = {
    backlogs:[],
    backlog: {},
    totalPages: 1
};

var backlogReducer = function(state = initialState, action) {
    if(action.type === types.BACKLOG_LIST_SUCCESS){
        return {...state, backlogs: action.backlogs, totalPages: action.totalPages};
    }
    if(action.type === types.BACKLOG_CHANGE){
        return {...state, backlog: action.backlog};
    }
    return state;
};

export {backlogReducer as default}