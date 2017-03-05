import * as types from './actionTypes';

export function changeProduct(product) {
    return {
        type: types.PRODUCT_CHANGE,
        product: product
    };
}

export function listProducts(products, totalPages) {
    return {
        type: types.PRODUCT_LIST_SUCCESS,
        products: products,
        totalPages: totalPages
    };
}

export function selectProducts(products) {
    return {
        type: types.PRODUCT_SELECT,
        selects: products,
    };
}

export function cancelSelectProducts(products) {
    return {
        type: types.PRODUCT_CANCEL_SELECT,
        selects: products,
    };
}