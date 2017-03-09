import * as types from './actionTypes';

export function changeEnterprise(enterprise) {
    return {
        type: types.ENTERPRISE_CHANGE,
        enterprise: enterprise
    };
}

export function listEnterprises(enterprises, totalPages) {
    return {
        type: types.ENTERPRISE_LIST_SUCCESS,
        enterprises: enterprises,
        totalPages: totalPages
    };
}