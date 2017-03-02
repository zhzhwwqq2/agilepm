/**
 * Created by sunlong on 16/7/10.
 */
var Team = require("../../domain/model/Team");

let teamService = {};

teamService.isMember = function (productId, userId) {
    return new Promise((resolve, reject)=>{
        Team.count({
            where:{productId: productId, userId: userId}
        }).then((data)=>{
            resolve(data>0);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

module.exports = teamService;