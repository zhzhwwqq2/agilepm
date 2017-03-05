import * as types from './actionTypes';

export function changeSprintBacklog(sprintBacklog) {
    return {
        type: types.SPRINTBACKLOG_CHANGE,
        sprintBacklog: sprintBacklog
    };
}

export function listTodo(sprintBacklogs, totalPages, currentPage) {
    return {
        type: types.SPRINTBACKLOG_TODO_LIST_SUCCESS,
        sprintBacklogs: sprintBacklogs,
        totalPages: totalPages,
        currentPage: currentPage
    };
}

export function listDoing(sprintBacklogs, totalPages, currentPage) {
    return {
        type: types.SPRINTBACKLOG_DOING_LIST_SUCCESS,
        sprintBacklogs: sprintBacklogs,
        currentPage: currentPage,
        totalPages: totalPages
    };
}
export function listDone(sprintBacklogs, totalPages, currentPage) {
    return {
        type: types.SPRINTBACKLOG_DONE_LIST_SUCCESS,
        sprintBacklogs: sprintBacklogs,
        currentPage: currentPage,
        totalPages: totalPages
    };
}

export function changeProgress(progress) {
    return {
        type: types.PROGRESS_CHANGE,
        progress: progress
    };
}