import * as types from '../actions/actionTypes';
const initialState = {
    enterprises:[],
    enterprise: {},
    totalPages: 1
};

var enterpriseReducer = function(state = initialState, action) {
    if(action.type === types.ENTERPRISE_LIST_SUCCESS){
        return {...state, enterprises: action.enterprises, totalPages: action.totalPages};
    }
    if(action.type === types.ENTERPRISE_CHANGE){
        return {...state, enterprise: action.enterprise};
    }
    return state;
};

export {enterpriseReducer as default}
