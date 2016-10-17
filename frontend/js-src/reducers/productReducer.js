import * as types from '../actions/actionTypes';
const initialState = {
    products:[],
    product:{},
    selects:[],
    totalPages: 1
};

var productReducer = function(state = initialState, action) {
    if(action.type === types.PRODUCT_LIST_SUCCESS){
        return {...state, products: action.products, totalPages: action.totalPages};
    }
    if(action.type === types.PRODUCT_CHANGE){
        return {...state, product: action.product};
    }
    if(action.type === types.PRODUCT_SELECT){
        let toAdd = [];
        action.selects.map((item)=>{
            if(state.selects.indexOf(item) == -1){
                toAdd.push(item);
            }
        });
        return {...state, selects: state.selects.concat(toAdd)};
    }
    if(action.type === types.PRODUCT_CANCEL_SELECT){
        let newSelects = state.selects.filter(function (item) {
            return action.selects.indexOf(item) == -1;
        });
        return {...state, selects: newSelects};
    }
    return state;
};

export {productReducer as default}
