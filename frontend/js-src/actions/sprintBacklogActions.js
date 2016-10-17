import * as types from './actionTypes';

export function changeSprintBacklog(sprintBacklog) {
    return {
        type: types.SPRINTBACKLOG_CHANGE,
        sprintBacklog: sprintBacklog
    };
}

export function listSprintBacklogs(sprintBacklogs, totalPages, currentPage) {
    return {
        type: types.SPRINTBACKLOG_LIST_SUCCESS,
        sprintBacklogs: sprintBacklogs,
        currentPage: currentPage,
        totalPages: totalPages
    };
}