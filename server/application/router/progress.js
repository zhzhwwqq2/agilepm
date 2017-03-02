/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var progressRouter = express.Router();
var Progress = require("../../domain/model/Progress");
var Result = require("../../infrastructure/common/Result");
var SprintBacklog = require("../../domain/model/SprintBacklog");
var moment = require('moment');

progressRouter.post('/api/progress', function (req, res) {
    Progress.findAll({
        where:{
            sprintBacklogId: req.body.sprintBacklogId
        },
        order: [['progress', 'DESC']]
    }).then(data=>{
        if(data == null || data.length == 0){
            create(data, req, res);
        }else{
            let id = exist(data, req.body.updatedDate);
            if(id){
                update(id, data, req, res);
            }else{
                if(req.body.progress <= data[0].progress && moment(data[0].updatedDate).isBefore(req.body.updatedDate)){//如果更新时间在后面，同时进度还小于前面，显然不合理
                    res.json(new Result("更新进度小于当前进度", false));
                }else if(req.body.progress >= data[0].progress && moment(data[0].updatedDate).isAfter(req.body.updatedDate)){//如果更新时间在前，但进度大于当前，也不合理
                    res.json(new Result("更新进度大于当前进度", false));
                }else{
                    create(data, req, res);
                }
            }
        }
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let create = function (progresses, req, res) {
    Progress.create({
        progress: req.body.progress,
        sprintBacklogId: req.body.sprintBacklogId,
        updatedDate: req.body.updatedDate,
        sprintId: req.body.sprintId,
    }).then((data)=>{
        updateSprintBacklog(progresses, req, res);
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
};

let update = function (id, progresses, req, res) {
    Progress.update({
        progress: req.body.progress,
        updatedDate: req.body.updatedDate,
    }, {where :{id: id}}).then((data)=>{
        updateSprintBacklog(progresses, req, res);
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
};

let updateSprintBacklog = function (progresses, req, res) {
    if(needUpdate(progresses, req.body.updatedDate)){
        let content = {
            progress: req.body.progress,
            updatedDate: req.body.updatedDate,
        };
        if( req.body.progress == 100){
            content.endDate = req.body.updatedDate
        }

        SprintBacklog.update(content, { where: {id: req.body.sprintBacklogId} }).then((data)=>{
            res.json(new Result());
        }).catch(error=>{
            console.log(error);
            res.json(new Result(error.message, false));
        });
    }else{
        res.json(new Result());
    }
};

let exist = (progresses, updatedDate)=>{
    let id = 0;
    for(let progress of progresses){
        if(moment(progress.updatedDate).isSame(updatedDate, 'day')){
            id = progress.id;
            break;
        }
    }
    return id;
};

let needUpdate = (progresses, updatedDate)=>{
    let needUpdate = true;
    for(let progress of progresses){
        if(moment(progress.updatedDate).isAfter(updatedDate)){//如果存在时间大于更新时间的，就不用更新sprintbacklog了
            needUpdate = false;
            break;
        }
    }
    return needUpdate;
};

module.exports = progressRouter;