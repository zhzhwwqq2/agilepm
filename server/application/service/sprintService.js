/**
 * Created by sunlong on 16/7/10.
 */
var Sprint = require("../../domain/model/Sprint");
var User = require("../../domain/model/User");
let sprintService = {};

/**
 * 分页获取某个产品所有sprints
 */
sprintService.allSprintsOfProduct = function (productId) {
    return new Promise((resolve, reject)=>{
        Sprint.findAndCountAll({
            where: {productId: productId} ,
            include: [{
                model: User,
                attributes:['id', 'name']
            }]
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    })
};

/**
 * 分页获取某个产品某个用户所有sprints
 */
sprintService.allSprintsOfProductAndUser = function (productId, userId) {
    return new Promise((resolve, reject)=>{
        Sprint.findAndCountAll({
            where: {productId: productId, userId: userId} ,
            include: [{
                model: User,
                attributes:['id', 'name']
            }]
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    })
};

module.exports = sprintService;