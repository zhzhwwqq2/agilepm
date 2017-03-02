/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var sprintRouter = express.Router();
var Sprint = require("../../domain/model/Sprint");
var SprintBacklog = require("../../domain/model/SprintBacklog");
var Result = require("../../infrastructure/common/Result");
var decodeToken = require('./auth').decodeToken;
var productService = require('../service/productService');
var sprintService = require('../service/sprintService');
var teamService = require('../service/teamService');
var moment = require('moment');

/**
 * 分页获取某个产品所有sprints
 */
sprintRouter.get('/api/sprints', function (req, res) {
    let user = decodeToken(req, res);

    let success = data => res.json(new Result({sprints: data.rows, totalPages: data.count}));
    let error = error => res.json(new Result(error.message, false));

    if(user.isAdmin){//todo: 需要判定这个用户是这个产品所在企业的管理员
        sprintService.allSprintsOfProduct(req.query.productId).then(success).catch(error)
    }else{
        teamService.isMember(req.query.productId, user.id).then(teams=>{
            sprintService.allSprintsOfProduct(req.query.productId).then(success).catch(error)
        }).catch(error);
    }
});

/**
 * 某人的sprint 总数
 */
sprintRouter.get('/api/sprints/count', function (req, res) {
    let user = decodeToken(req, res);

    Sprint.count({where :{userId: user.id}}).then((data)=>{
        res.json(new Result(data));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 某人正在进行的sprint
 */
sprintRouter.get('/api/sprints/latest', function (req, res) {
    let user = decodeToken(req, res);
    Sprint.findAll({
        where: {userId: user.id, endDate: null} ,
    }).then((data)=>{
        res.json(new Result({sprints: data}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 获取某个产品所有未结束的sprints
 */
sprintRouter.get('/api/allSprints', function (req, res) {
    Sprint.findAll({ where: {productId: req.query.productId, endDate: null} }).then((data)=>{
        res.json(new Result(data));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 创建sprint
 */
sprintRouter.post('/api/sprint', function (req, res) {
    let success = data => res.json(new Result());
    let error = error => res.json(new Result(error.message, false));

    Sprint.create({
        name: req.body.name,
        planningEndDate: req.body.planningEndDate,
        endDate: req.body.endDate,
        startDate: req.body.startDate,
        productId: req.body.productId,
        userId: req.body.userId,
    }).then(success).catch(error);
});

/**
 * 修改sprint
 */
sprintRouter.put('/api/sprint/:id', function (req, res) {
    Sprint.update({
        name: req.body.name,
        planningEndDate: req.body.planningEndDate,
        endDate: req.body.endDate,
        startDate: req.body.startDate,
        productId: req.body.productId,
        userId: req.body.userId,
    }, { where: {id: req.body.id} }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 删除sprint
 */
sprintRouter.delete('/api/sprint/:id', function (req, res) {
    Sprint.destroy({
        where: { id: req.params.id }
    }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 燃尽图
 */
sprintRouter.get('/api/sprint/status', function (req, res) {
    Sprint.findById(req.query.id).then((sprint)=>{
        let [days, plan] = sprintDays(sprint);
        finished(days, req.query.id).then(finishedHours => {
            res.json(new Result({plan: plan, fact: fact(plan[0], finishedHours, days), days: days}));
        });
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let fact = function (total, finishedHours, days) {
    let fact = [];
    for(let i=0; i<days.length; i++){
        fact.push(total - finishedHours.get(days[i]));
    }
    console.log(fact);
    return fact;
};

let sprintDays = function (sprint) {
    let startDate = sprint.startDate;
    let planningEndDate = sprint.planningEndDate;

    let day = moment(startDate),
        days = [],
        plan = [];

    if(planningEndDate!=null){
        let i = 0;
        while(!moment(planningEndDate).isSame(day, 'day')){
            days.push(moment(day).format('YYYY-MM-DD'));
            day = day.add(1, 'day');
            plan.unshift(8*i++);
        }
    }
    return [days, plan];
};

let finished = function (days, sprintId) {
    return new Promise((resolve, reject)=>{
        let finished = 0;
        let finishedHours = new Map();
        for(let day of days){
            let newDay = moment(day).hour(23).minute(59).second(59);
            SprintBacklog.findAll({
                where:{
                    sprintId: sprintId,
                    updatedDate: {$lte: newDay}
                }
            }).then(sprintBacklogs => {
                let finishedHour = 0;
                for(let sprintBacklog of sprintBacklogs){
                    finishedHour += sprintBacklog.estimate*sprintBacklog.progress/100;
                }
                finishedHours.set(day, finishedHour);
                if(++finished == days.length){
                    resolve(finishedHours);
                }
            }).catch(error => console.log(error));
        }
    });
};

module.exports = sprintRouter;