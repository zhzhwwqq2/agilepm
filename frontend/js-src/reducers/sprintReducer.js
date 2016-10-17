import * as types from '../actions/actionTypes';
const initialState = {
    sprints:[],
    sprint: {},
    totalPages: 1
};

var sprintReducer = function(state = initialState, action) {
    if(action.type === types.SPRINT_LIST_SUCCESS){
        return {...state, sprints: action.sprints, totalPages: action.totalPages};
    }
    if(action.type === types.SPRINT_CHANGE){
        return {...state, sprint: action.sprint};
    }
    return state;
};

export {sprintReducer as default}
