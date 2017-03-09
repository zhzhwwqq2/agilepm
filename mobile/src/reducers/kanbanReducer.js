import * as types from '../actions/actionTypes';
const initialState = {
    todo:{items:[], totalPages:1},
    doing:{items:[], totalPages:1},
    done:{items:[], totalPages:1},
    sprintBacklog:{},
    progress:{},
};

var kanbanReducer = function(state = initialState, action) {
    if(action.type === types.SPRINTBACKLOG_TODO_LIST_SUCCESS){
        return {...state, todo: {items: action.sprintBacklogs, totalPages: action.totalPages}};
    }
    if(action.type === types.SPRINTBACKLOG_DOING_LIST_SUCCESS){
        return {...state, doing: {items: action.sprintBacklogs, totalPages: action.totalPages}};
    }
    if(action.type === types.SPRINTBACKLOG_DONE_LIST_SUCCESS){
        return {...state, done: {items: action.sprintBacklogs, totalPages: action.totalPages}};
    }
    if(action.type === types.SPRINTBACKLOG_ALL_LIST_SUCCESS){
        return {...state, done: {items: action.sprintBacklogs, totalPages: action.totalPages}};
    }
    if(action.type === types.SPRINTBACKLOG_CHANGE){
        return {...state, sprintBacklog: action.sprintBacklog};
    }
    if(action.type === types.PROGRESS_CHANGE){
        return {...state, progress: action.progress};
    }
    return state;
};

export {kanbanReducer as default}