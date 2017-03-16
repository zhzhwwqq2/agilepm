// const URL = "http://localhost:3000/api";
const URL = 'http://pm.itxshe.com/api';

const STATIC = false;

let API_URL = {

};

if (!STATIC) {
    API_URL = {
        product: {
            list: `${URL}/products`,
            latest: `${URL}/products/latest`,
            count: `${URL}/products/count`,
            del: `${URL}/product/`,
            add: `${URL}/product`,
            update: `${URL}/product`,
            exportExcel: `${URL}/product/exportExcel`,
            members: `${URL}/product/members`,
        },
        backlog: {
            list: `${URL}/backlogs`,
            del: `${URL}/backlog/`,
            add: `${URL}/backlog`,
            update: `${URL}/backlog`,
            add2Sprint: `${URL}/backlog/add2Sprint`,
            delFromSprint: `${URL}/backlog/delFromSprint`,
        },
        sprint: {
            list: `${URL}/sprints`,
            latest: `${URL}/sprints/latest`,
            count: `${URL}/sprints/count`,
            listAll: `${URL}/allSprints`,
            del: `${URL}/sprint/`,
            add: `${URL}/sprint`,
            update: `${URL}/sprint`,
            status: `${URL}/sprint/status`,
        },
        sprintBacklog: {
            list: `${URL}/sprintBacklogs`,
            todo: `${URL}/sprintBacklogs/todo`,
            count: `${URL}/sprintBacklogs/count`,
            del: `${URL}/sprintBacklog/`,
            add: `${URL}/sprintBacklog`,
            update: `${URL}/sprintBacklog`,
            doing: `${URL}/sprintBacklogs/doing`,
            doingOfSprint: `${URL}/sprintBacklogs/doingOfSprint`,
            done: `${URL}/sprintBacklogs/done`,
            start: `${URL}/sprintBacklog/start`,
            endDate: `${URL}/sprintBacklog/endDate`,
            exportExcel: `${URL}/sprintBacklog/exportExcel`,
        },
        enterprise: {
            del: `${URL}/enterprise/`,
            add: `${URL}/enterprise`,
            update: `${URL}/enterprise/`,
            list: `${URL}/enterprises`,
        },
        user: {
            list: `${URL}/users`,
            listAll: `${URL}/allUsers`,
            del: `${URL}/user/`,
            add: `${URL}/user`,
            update: `${URL}/user`,
            login: `${URL}/login`,
            info: `${URL}/user/info`,
            updateInfo: `${URL}/user/info`,
            password: `${URL}/user/password`,
            register: `${URL}/user/register`,
        },
        progress: {
            add: `${URL}/progress`,
        },
    };
}

export { API_URL as default };
