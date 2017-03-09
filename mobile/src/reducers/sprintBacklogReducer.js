import * as types from '../actions/actionTypes';
const initialState = {
    sprintBacklogs:[],//所有的sprintBacklog
    sprintBacklog:{},//当前的sprintBacklog
    totalPages: 1,
    currentPage: 1,
};

var sprintBacklogReducer = function(state = initialState, action) {
    if(action.type === types.SPRINTBACKLOG_LIST_SUCCESS){
        return {...state, sprintBacklogs: action.sprintBacklogs, totalPages: action.totalPages, currentPage: action.currentPage};
    }
    if(action.type === types.SPRINTBACKLOG_CHANGE){
        return {...state, sprintBacklog: action.sprintBacklog};
    }
    return state;
};

export {sprintBacklogReducer as default}