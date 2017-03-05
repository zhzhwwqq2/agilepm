import * as types from './actionTypes';

export function changeBacklog(backlog) {
    return {
        type: types.BACKLOG_CHANGE,
        backlog: backlog
    };
}

export function listBacklogs(backlogs, totalPages, currentPage) {
    return {
        type: types.BACKLOG_LIST_SUCCESS,
        backlogs: backlogs,
        totalPages: totalPages,
        currentPage: currentPage
    };
}