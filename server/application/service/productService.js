/**
 * Created by sunlong on 16/7/10.
 */
var Product = require("../../domain/model/Product");
var User = require("../../domain/model/User");

let productService = {};

productService.isOwner = function (productId, userId) {
    return new Promise((resolve, reject)=>{
        Product.count({
            where:{id: productId, userId: userId}
        }).then((data)=>{
            resolve(data>0);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

productService.allProductsOfUsers = function (ids) {
    return new Promise((resolve, reject)=>{
        Product.findAll({
            include: [{
                attributes:['id','name'],
                model: User,
                as: "user"
            }],
            where : {userId: {$in:ids}, deleted: false}
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    })
};

productService.allProducts = function (ids) {
    return new Promise((resolve, reject)=>{
        Product.findAll({
            include: [{
                attributes:['id','name'],
                model: User,
                as: "user"
            }],
            where : {id: {$in:ids}, deleted: false}
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    })
};


module.exports = productService;