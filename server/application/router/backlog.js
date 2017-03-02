/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var backlogRouter = express.Router();
var Backlog = require("../../domain/model/Backlog");
var Sprint = require("../../domain/model/Sprint");
var Product = require("../../domain/model/Product");
var Result = require("../../infrastructure/common/Result");
var decodeToken = require('./auth').decodeToken;
var productService = require("../service/productService");
var teamService = require("../service/teamService");

backlogRouter.get('/api/backlogs', function (req, res) {
    Backlog.findAndCountAll({
        where: {productId: req.query.productId},
        order: [['createdAt', 'DESC']],
        include: [{
            attributes:['id','name'],
            model: Sprint,
            as: "sprint"
        }],
    }).then((data)=>{
        res.json(new Result({backlogs: data.rows, totalPages: data.count}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

backlogRouter.post('/api/backlog', function (req, res) {
    let user = decodeToken(req, res);
    let error = error => res.json(new Result(error.message, false));

    teamService.isMember(req.body.productId, user.id).then(isMember => {
        if(isMember){
            Backlog.create({
                name: req.body.name,
                story: req.body.story,
                demo: req.body.demo,
                note: req.body.note,
                productId: req.body.productId,
                importance: req.body.importance,
            }).then((data)=>{
                res.json(new Result());
            }).catch(error);
        }else{
            res.json(new Result("你不属于这个产品组, 没有添加权限!", false));
        }
    }).catch(error);
});

backlogRouter.put('/api/backlog/:id', function (req, res) {
    let user = decodeToken(req, res);
    let error = error => res.json(new Result(error.message, false));

    teamService.isMember(req.body.productId, user.id).then(isMember => {
        if(isMember){
            Backlog.update({
                name: req.body.name,
                story: req.body.story,
                demo: req.body.demo,
                note: req.body.note,
                importance: req.body.importance,
            }, { where: {id: req.body.id} }).then((data)=>{
                res.json(new Result());
            }).catch(error);
        }else{
            res.json(new Result("你不属于这个产品组, 没有修改权限!", false));
        }
    }).catch(error);
});

backlogRouter.delete('/api/backlog/:id', function (req, res) {
    let user = decodeToken(req, res);
    let error = error => res.json(new Result(error.message, false));
    productService.isOwner(req.query.productId, user.id).then(isOwner => {
        if(isOwner){
            Backlog.destroy({
                where: { id: req.params.id }
            }).then((data)=>{
                res.json(new Result());
            }).catch(error);
        }else{
            res.json(new Result("你不是这个产品的负责人, 没有删除权限!", false));
        }
    }).catch(error);
});

/**
 * 添加到sprint
 */
backlogRouter.post('/api/backlog/add2Sprint', function (req, res) {
    let backlogIds = req.body.backlogs;

    Backlog.update({sprintId: req.body.sprintId}, {where: {id: {$in: backlogIds}}}).then(()=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

backlogRouter.post('/api/backlog/delFromSprint', function (req, res) {
    Backlog.update({sprintId: null}, {where: {id: req.body.id}}).then(()=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

module.exports = backlogRouter;