/**
 * Created by sunlong on 16/7/10.
 */
"use strict";

var express = require('express');
var productRouter = express.Router();
var Product = require("../../domain/model/Product");
var Sprint = require("../../domain/model/Sprint");
var SprintBacklog = require("../../domain/model/SprintBacklog");
var Progress = require("../../domain/model/Progress");
var Team = require("../../domain/model/Team");

var Result = require("../../infrastructure/common/Result");
var moment = require('moment');
var decodeToken = require('./auth').decodeToken;
var userService = require('../service/userService');
var productService = require('../service/productService');
var export_table_to_excel=require("./Excel");

/**
 * 某人所有的产品, 管理员可以看到他企业下的所有产品
 */
productRouter.get('/api/products', function (req, res) {
    let user = decodeToken(req, res);
    let error = error=> res.json(new Result(error.message, false));

    if(user.isAdmin){
        userService.allUserOfEnterprise(user.enterpriseId).then(data=> {
            let userIds = [];
            for(let user of data){
                userIds.push(user.id);
            }
            productService.allProductsOfUsers(userIds).then(data=> res.json(new Result({products: data}))).catch(error);
        }).catch(error=> {
            res.json(new Result(error.message, false));
        });
    }else{
        Team.findAll({where:{userId: user.id}}).then(teams=>{
            let productIds = teams.map( team=> team.productId);
            productService.allProducts(productIds).then(data=> res.json(new Result({products: data}))).catch(error);
        }).catch(error);
    }
});

/**
 * 某人最新的5个产品
 * 如果这个用户是企业管理员,可以企业最新5个产品
 */
productRouter.get('/api/products/latest', function (req, res) {
    let user = decodeToken(req, res);

    Product.findAll({where :{userId: user.id, deleted: false}, limit: 5, order: [['createdAt', 'DESC']]}).then((data)=>{
        res.json(new Result({products: data}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 某人的产品总数
 * 如果这个用户是企业管理员,可以企业产品总数
 */
productRouter.get('/api/products/count', function (req, res) {
    let user = decodeToken(req, res);

    Product.count({where :{userId: user.id, deleted: false}}).then((data)=>{
        res.json(new Result(data));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let executeExport = function (productIds, res) {
    Sprint.findAll({ attributes: ['id'], where: {productId: {$in: productIds}} }).then((sprints)=>{
        let sprintIds = sprints.map(sprint=> sprint.id);
        findProgresses(sprintIds);
    });

    let monday = moment().isoWeekday(1).format("YYYY-MM-DD");
    let nextMonday = moment(monday).add(7, 'day');
    let findProgresses = function(sprintIds){
        Progress.findAll({
            where: {
                sprintId: {$in: sprintIds },
                updatedDate: {
                    $lt: nextMonday,
                    $gt: monday
                },
            },
            include: [{
                attributes: ['id','name'],
                model: SprintBacklog,
                as: 'sprintBacklog'
            }],
        }).then((sprintBacklogs)=>{
            sendExcel(sprintBacklogs);
        });
    };

    let filter = function (day, allSprintBacklogs) {
        let allFiltered = [];
        for(let backlog of allSprintBacklogs) {
            if (moment(backlog.updatedDate).isSame(day, 'day')) {
                allFiltered.push(backlog);
            }
        }

        return allFiltered;
    };

    let sHead = {
        fill:{
            fgColor: { rgb: "FFA4B960" },
            bgColor: {  rgb: "FFA4B960" }
        },
        font:{
            color:{ rgb: "FFFFFFFF" },
            sz: 18,
        },
        alignment:{
            horizontal:'center'
        }
    };

    let border = {
        top: { style: 'thin', color: { rgb: "FF000000" } },
        bottom: { style: 'thin', color: { rgb: "FF000000" } },
        left: { style: 'thin', color: { rgb: "FF000000" } },
        right: { style: 'thin', color: { rgb: "FF000000" } },
    };

    let sHead2 = {
        fill:{
            fgColor: { rgb: "FFD8E2BB" },
            bgColor: {  rgb: "FFD8E2BB" }
        },
        font:{
            sz: 16,
        },
        alignment:{
            horizontal:'center'
        },
    };

    let sHead3 = {
        font:{
            sz: 16,
        },
        alignment:{
            horizontal:'center'
        },
    };

    let sBody = {
        fill:{
            fgColor: { rgb: "FFD8E2BB" },
            bgColor: {  rgb: "FFD8E2BB" }
        },
        font:{
            sz: 14,
        },
        border: border,
    };

    let sendExcel = function (allSprintBacklogs) {
        let backlogs = [
            [null,{v:`米果科技 工作周报       日期：${monday} - ${nextMonday.format("YYYY-MM-DD")}（第 2 周）`, s:sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}, {v:'', s: sHead}],
            [null,{v:"本　周　工　作　记　录", s:sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}, {v:'', s: sHead2}],
            [null,{v:"本周重点工作内容", s:sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}, {v:'', s: sHead3}]
        ];
        let weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

        let ranges = [
            {s:{r:0, c:1},e:{r:0, c:16}},
            {s:{r:1, c:1},e:{r:1, c:16}},
            {s:{r:2, c:1},e:{r:2, c:16}}
        ];
        let nextStart = ranges.length;
        for(let i=1; i<=weeks.length; i++){
            let day = moment().isoWeekday(i).format("YYYY-MM-DD");
            let backlogsOfDay = filter(day, allSprintBacklogs);
            for(var j=0; j<backlogsOfDay.length; j++){
                if(j == 0){
                    backlogs.push([null, {v:weeks[i-1], s:sBody}, {v:"", s:sBody}, {v:"",s:sBody}, {v:backlogsOfDay[j].sprintBacklog.name, s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:backlogsOfDay[j].progress+'%',s:sBody}]);
                }else{
                    backlogs.push([null, {v:"", s:sBody}, {v:"", s:sBody}, {v:"",s:sBody}, {v:backlogsOfDay[j].sprintBacklog.name,s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:"", s:sBody},{v:backlogsOfDay[j].progress+'%',s:sBody}]);
                }
                ranges.push({s:{r:nextStart+j, c:4},e:{r:nextStart+j, c:15}});
            }
            if(backlogsOfDay.length != 0){
                mergeWeek(nextStart, nextStart+backlogsOfDay.length-1, ranges);
            }
            nextStart = nextStart+backlogsOfDay.length;
        }

        let sDifficult = {
            fill:{
                fgColor: { rgb: "FFFFFF9D" },
                bgColor: {  rgb: "FFFFFF9D" }
            },
            font:{
                sz: 14,
            },
            border: border,
            alignment:{
                horizontal:'center'
            }
        };
        backlogs.push([null,{v:"本周困难/疑难问题", s:sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}]);
        backlogs.push([null,{v:"", s:sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}]);
        backlogs.push([null,{v:"", s:sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}, {v:'', s: sDifficult}]);

        sBody.alignment = {horizontal:'center'};
        backlogs.push([null,{v:"下 周 工 作 计 划", s:sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}, {v:'', s: sBody}]);

        ranges.push({s:{r:nextStart, c:1},e:{r:nextStart, c:16}});
        ranges.push({s:{r:nextStart+1, c:1},e:{r:nextStart+1, c:16}});
        ranges.push({s:{r:nextStart+2, c:1},e:{r:nextStart+2, c:16}});
        ranges.push({s:{r:nextStart+3, c:1},e:{r:nextStart+3, c:16}});


        backlogs.push([null, '序号', '事项', '', '责任人', '', '初始计划完成时间', '', '', '是否完成', '未完成原因', '', '解决办法', '', '更改后时间', '第几次修订', '备注']);
        backlogs.push([null, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}]);
        backlogs.push([null, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}]);
        backlogs.push([null, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}]);
        backlogs.push([null, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}]);
        backlogs.push([null, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}, {v:'',s:{border: border}}]);

        var buffer = export_table_to_excel(backlogs, ranges);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader("Content-Disposition", "attachment; filename=weeklyReport.xlsx");
        res.end(buffer, 'binary');
    };
};

function mergeWeek(start, end, ranges){
    ranges.push({s:{r:start, c:1},e:{r:end, c:2}});
}

/**
 * 导出周报
 */
productRouter.get('/api/product/exportExcel', function (req, res) {
    let productIds = req.query.productIds.split(",").map((strProductId)=> parseInt(strProductId));
    executeExport(productIds, res);
});

/**
 * 创建产品
 */
productRouter.post('/api/product', function (req, res) {
    let user = decodeToken(req, res);
    let userId = user.id;
    if(user.isAdmin){
        userId = req.body.userId;
    }

    let error = error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    };

    Product.create({
        name: req.body.name,
        userId: userId
    }).then((data)=>{
        Team.create({
            productId: data.id,
            userId: userId,
        }).then(data => res.json(new Result())).catch(error);
    }).catch(error);
});

/**
 * 修改产品
 */
productRouter.put('/api/product/:id', function (req, res) {
    let user = decodeToken(req, res);
    let userId = user.id;
    if(user.isAdmin){
        userId = req.body.userId;
    }
    Product.update({
        name: req.body.name,
        userId: userId
    }, { where: {id: req.body.id} }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 删除产品
 */
productRouter.delete('/api/product/:id', function (req, res) {
    Product.update({
        deleted: true
    },{
        where: { id: req.params.id }
    }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 修改产品成员
 */
productRouter.post('/api/product/members', function (req, res) {
    Team.destroy({
        where: { productId: req.body.productId }
    }).then((data)=>{
        let finished = 0;
        for(let userId of req.body.userIds){
            Team.create({
                productId: req.body.productId,
                userId: userId,
            }).then((data)=>{
                finished++;
                if(finished == req.body.userIds.length){
                    res.json(new Result());
                }
            }).catch(error=>{
                finished++;
                console.log(error);
                res.json(new Result(error.message, false));
            });
        }
        if(req.body.userIds.length==0){
            res.json(new Result());
        }
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 获取产品成员
 */
productRouter.get('/api/product/members', function (req, res) {
    Team.findAll({
        attributes:['userId'],
        where: { productId: req.query.productId }
    }).then((data)=>{
        let userIds = data.map(team => team.userId);
        res.json(new Result(userIds));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

module.exports = productRouter;