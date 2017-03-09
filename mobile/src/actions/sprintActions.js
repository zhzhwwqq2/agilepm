import * as types from './actionTypes';

export function changeSprint(sprint) {
    return {
        type: types.SPRINT_CHANGE,
        sprint: sprint
    };
}

export function listSprints(sprints, totalPages) {
    return {
        type: types.SPRINT_LIST_SUCCESS,
        sprints: sprints,
        totalPages: totalPages
    };
}