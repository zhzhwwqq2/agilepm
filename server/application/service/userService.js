/**
 * Created by sunlong on 16/7/10.
 */
var User = require("../../domain/model/User");
var bcrypt = require('bcrypt');

let userService = {};

userService.allUserOfEnterprise = function (enterpriseId) {
    return new Promise((resolve, reject)=>{
        User.findAll({
            attributes:['id','name','isAdmin','email','enterpriseId','createdAt'],
            where:{enterpriseId: enterpriseId}
        }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

userService.createUser = function (user) {
    return new Promise((resolve, reject)=>{
        user.password = bcrypt.hashSync(user.password, 8);

        User.create(user).then((user)=>{
            resolve(user);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

userService.isSame = function (password, hashed) {
    return bcrypt.compareSync(password, hashed);
};

userService.resetPassword = function(id, password){
    return new Promise((resolve, reject)=>{
        User.update({
            password: bcrypt.hashSync(password, 8),
        }, { where: {id: id} }).then((data)=>{
            resolve(data);
        }).catch(error=>{
            console.log(error);
            reject(error);
        });
    });
};

module.exports = userService;