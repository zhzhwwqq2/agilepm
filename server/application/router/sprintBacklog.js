/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var sprintBacklogRouter = express.Router();
var SprintBacklog = require("../../domain/model/SprintBacklog");
var User = require("../../domain/model/User");
var Progress = require("../../domain/model/Progress");
var Result = require("../../infrastructure/common/Result");
var export_table_to_excel=require("./Excel");
var moment = require('moment');
var decodeToken = require('./auth').decodeToken;

/**
 * 全部
 */
sprintBacklogRouter.get('/api/sprintBacklogs', function (req, res) {
    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
    SprintBacklog.count({
        where: {sprintId: req.query.sprintId} ,
    }).then((data)=>{
        findBySprint(data, page, req, res);
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let findBySprint = function (count, page, req, res) {
    SprintBacklog.findAll({
        where: {sprintId: req.query.sprintId} ,
        offset: (page-1)*10,
        limit: 10,
        include: [{
            attributes: ['id','name'],
            model: User,
            as: "user"
        }],
        order: [['updatedAt', 'DESC']]
    }).then((data)=>{
        res.json(new Result({sprintBacklogs: data, totalPages: count}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
};

/**
 * 某个用户sprint backlog总数
 */
sprintBacklogRouter.get('/api/sprintBacklogs/count', function (req, res) {
    let user = decodeToken(req, res);

    SprintBacklog.count({where :{userId: user.id}}).then((data)=>{
        res.json(new Result(data));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 某人正在进行的sprint backlog
 */
sprintBacklogRouter.get('/api/sprintBacklogs/doing', function (req, res) {
    let user = decodeToken(req, res);

    SprintBacklog.findAll({
        attributes: ['id', 'name', 'startDate', 'estimate', 'progress', 'sprintId'],
        where: {userId: user.id, progress: {$lt: 100}} ,
        limit: 20
    }).then((data)=>{
        res.json(new Result(data));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 正在进行的sprint backlog
 */
sprintBacklogRouter.get('/api/sprintBacklogs/doingOfSprint', function (req, res) {
    doing(req.query.sprintId).then(data=>{
        res.json(new Result({sprintBacklogs: data.rows, totalPages: data.count}));
    }).catch(error=>{
        res.json(new Result(error.message, false));
    })
});

let doing = function (id) {
    return new Promise((resovle, reject)=>{
        SprintBacklog.findAndCount({
            attributes: ['id', 'name', 'startDate', 'updatedDate', 'estimate', 'progress', 'sprintId'],
            include: [{
                attributes: ['id','name'],
                model: User,
                as: "user"
            }],
            where: {sprintId: id, progress: {$lt: 100}},
            order: [['updatedAt', 'DESC']]
        }).then((data)=>{
            resovle(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

/**
 * 已完成的sprint backlog
 */
sprintBacklogRouter.get('/api/sprintBacklogs/done', function (req, res) {
    SprintBacklog.findAndCount({
        attributes: ['id', 'name', 'startDate', 'estimate', 'progress', 'endDate', 'sprintId'],
        include: [{
            attributes: ['id','name'],
            model: User,
            as: "user"
        }],
        where: {sprintId: req.query.sprintId, progress: 100},
        order: [['updatedAt', 'DESC']]
    }).then((data)=>{
        res.json(new Result({sprintBacklogs: data.rows, totalPages: data.count}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 待做的sprint backlog
 */
sprintBacklogRouter.get('/api/sprintBacklogs/todo', function (req, res) {
    todo(req.query.sprintId).then((data)=>{
        res.json(new Result({sprintBacklogs: data.rows, totalPages: data.count}));
    }).catch((error)=>{
        res.json(new Result(error.message, false));
    });
});

let todo = function (id) {
    return new Promise(function (resolve, reject) {
        SprintBacklog.findAndCount({
            attributes: ['id', 'name', 'startDate', 'estimate', 'progress', 'sprintId'],
            where: {sprintId: id, progress: null},
            order: [['updatedAt', 'DESC']]
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

/**
 * 新增
 */
sprintBacklogRouter.post('/api/sprintBacklog', function (req, res) {
    SprintBacklog.create({
        name: req.body.name,
        story: req.body.story,
        demo: req.body.demo,
        note: req.body.note,
        estimate: req.body.estimate ? req.body.estimate : 0,
        userId: req.body.userId,
        sprintId: req.body.sprintId,
        importance: req.body.importance,
    }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 开始
 */
sprintBacklogRouter.put('/api/sprintBacklog/start', function (req, res) {
    SprintBacklog.update({
        userId: req.body.userId,
        startDate: req.body.startDate,
        updatedDate: req.body.startDate,
        progress: 0,
    }, { where: {id: req.body.id} }).then((data)=>{
        Progress.create({
            progress: 0,
            sprintBacklogId: req.body.id,
            updatedDate: req.body.startDate,
            sprintId: req.body.sprintId,
        }).then((data)=>{
            res.json(new Result());
        }).catch(error=>{
            console.log(error);
            res.json(new Result(error.message, false));
        });
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 修改完成时间
 */
sprintBacklogRouter.put('/api/sprintBacklog/endDate', function (req, res) {
    SprintBacklog.update({
        endDate: req.body.endDate,
    }, { where: {id: req.body.id} }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 修改
 */
sprintBacklogRouter.put('/api/sprintBacklog/:id', function (req, res) {
    SprintBacklog.update({
        name: req.body.name,
        story: req.body.story,
        demo: req.body.demo,
        note: req.body.note,
        estimate: req.body.estimate ? req.body.estimate : 0,
        userId: req.body.userId,
        sprintId: req.body.sprintId,
        progress: req.body.progress,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        importance: req.body.importance,
    }, { where: {id: req.body.id} }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 删除
 */
sprintBacklogRouter.delete('/api/sprintBacklog/:id', function (req, res) {
    let error = error => {
        console.log(error);
        res.json(new Result(error.message, false));
    };

    Progress.destroy({
        where: { sprintBacklogId: req.params.id }
    }).then((data)=>{
        SprintBacklog.destroy({
            where: { id: req.params.id }
        }).then((data)=>{
            res.json(new Result());
        }).catch(error);
    }).catch(error);
});

let executeExport = function (sprintId) {
    return new Promise((resolve, reject)=>{
        let sprintBacklogsTodo = null;
        let sprintBacklogsDoing = null;
        let sprintBacklogsDone = null;

        let finished = 0;
        todo(sprintId).then(data=> {
            sprintBacklogsTodo = data.rows;
            if(++finished == 3){
                resolve([sprintBacklogsTodo, sprintBacklogsDoing, sprintBacklogsDone]);
            }
        }).catch(error=> finished++);

        doing(sprintId).then(data=> {
            sprintBacklogsDoing = data.rows;
            if(++finished == 3){
                resolve([sprintBacklogsTodo, sprintBacklogsDoing, sprintBacklogsDone]);
            }
        }).catch(error=> finished++);

        let monday = moment().isoWeekday(1).format("YYYY-MM-DD");
        let nextMonday = moment(monday).add(7, 'day');
        SprintBacklog.findAll({
            attributes: ['id', 'name', 'startDate', 'estimate', 'progress', 'endDate', 'sprintId'],
            include: [{
                attributes: ['id','name'],
                model: User,
                as: "user"
            }],
            where: {
                sprintId: sprintId,
                progress: 100,
                $or:{
                    startDate: {
                        $lt: nextMonday,
                        $gt: monday
                    },
                    endDate: {
                        $lt: nextMonday,
                        $gt: monday
                    },
                }
            },
            order: [['updatedAt', 'DESC']]
        }).then((data)=>{
            sprintBacklogsDone = data;
            if(++finished == 3){
                resolve([sprintBacklogsTodo, sprintBacklogsDoing, sprintBacklogsDone]);
            }
        }).catch(error=>{
            console.log(error);
            finished++;
        });
    });
};

sprintBacklogRouter.get('/api/sprintBacklog/exportExcel', function (req, res) {
    let sprintIds = req.query.sprintIds.split(",").map((str)=> parseInt(str));

    let finished = 0,
        allTodo = [],
        allDoing = [],
        allDone = [];
    for(let sprintId of sprintIds){
        executeExport(sprintId).then(([todo, doing, done]) => {
            allTodo = allTodo.concat(todo);
            allDoing = allDoing.concat(doing);
            allDone = allDone.concat(done);
            if(++finished == sprintIds.length){
                let buffer = sendExcel(allTodo, allDoing, allDone);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader("Content-Disposition", "attachment; filename=dailyReport.xlsx");
                res.end(buffer, 'binary');
            }
        });
    }
});

let sendExcel = function (sprintBacklogsTodo, sprintBacklogsDoing, sprintBacklogsDone) {
    let maxLength = sprintBacklogsTodo.length;
    if(maxLength < sprintBacklogsDoing.length){
        maxLength = sprintBacklogsDoing.length;
    }
    if(maxLength < sprintBacklogsDone.length){
        maxLength = sprintBacklogsDone.length;
    }

    let content = (item, key) => {
        let keys = key.split(".");
        if(keys.length>1){
            let subItem = keys[0];
            let subItemKey = keys[1];
            return item ? (item[subItem] ? item[subItem][subItemKey]: '') : '';
        }
        return item ? (item[key]!=null?item[key]:'') : '';
    };

    let border = {
        top: { style: 'thin', color: { rgb: "FF9DB2D4" } },
        bottom: { style: 'thin', color: { rgb: "FF9DB2D4" } },
        left: { style: 'thin', color: { rgb: "FF9DB2D4" } },
        right: { style: 'thin', color: { rgb: "FF9DB2D4" } },
    };

    let sHead = {
        fill:{
            fgColor: { rgb: "FFBCCBE2" },
            bgColor: {  rgb: "FFBCCBE2" }
        },
        font:{
            color:{ rgb: "FFA7703B" },
            sz: 24,
        },
        alignment:{
            horizontal:'center'
        },
        border:border
    };

    let sHead2 = {
        fill:{
            fgColor: { rgb: "FFBCCBE2" },
            bgColor: {  rgb: "FFBCCBE2" }
        },
        font:{
            color:{ rgb: "FFA7703B" },
            sz: 16,
        },
        alignment:{
            horizontal:'center'
        },
        border:border
    };

    let sTodo = {
        fill:{
            fgColor: { rgb: "FFECF1DD" },
            bgColor: {  rgb: "FFECF1DD" }
        },
        border:border
    };

    let sDoing = {
        fill:{
            fgColor: { rgb: "FFDDE4F0" },
            bgColor: {  rgb: "FFDDE4F0" }
        },
        border:border
    };

    let sDone = {
        fill:{
            fgColor: { rgb: "FFD9E2BD" },
            bgColor: {  rgb: "FFD9E2BD" }
        },
        border:border
    };

    let backlogs = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, {v:'Todo', s: sHead}, {v:'', s: sHead}, {v:'Doing', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'Done', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}],
        [null, {v:'内容', s:sHead2},{v:'备注', s:sHead2},{v:'负责人', s:sHead2},{v:'内容', s:sHead2},{v:'进度', s:sHead2},{v:'备注', s:sHead2},{v:'负责人', s:sHead2},{v:'内容', s:sHead2},{v:'备注', s:sHead2}]
    ];
    for(let i=0; i < maxLength; i++){
        backlogs.push([null, {v:content(sprintBacklogsTodo[i], 'name'),s:sTodo}, {v:content(sprintBacklogsTodo[i], 'note'), s:sTodo},
            {v:content(sprintBacklogsDoing[i], 'user.name'), s:sDoing}, {v:content(sprintBacklogsDoing[i], 'name'), s:sDoing}, {v:content(sprintBacklogsDoing[i], 'progress')+'%', s:sDoing}, {v:content(sprintBacklogsDoing[i], 'note'), s:sDoing},
            {v:content(sprintBacklogsDone[i], 'user.name'), s:sDone}, {v:content(sprintBacklogsDone[i], 'name'), s:sDone}, {v:content(sprintBacklogsDone[i], 'note'), s:sDone}]);
    }

    let ranges = [{s:{r:1, c:1},e:{r:1, c:2}}, {s:{r:1, c:3},e:{r:1, c:6}}, {s:{r:1, c:7},e:{r:1, c:9}}];
    return export_table_to_excel(backlogs, ranges);
};

module.exports = sprintBacklogRouter;