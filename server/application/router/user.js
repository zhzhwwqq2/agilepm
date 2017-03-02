/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var userRouter = express.Router();
var User = require("../../domain/model/User");
var Enterprise = require("../../domain/model/Enterprise");
var Team = require("../../domain/model/Team");
var Result = require("../../infrastructure/common/Result");
var decodeToken = require('./auth').decodeToken;
var generateToken = require('./auth').generateToken;
var userService = require('../service/userService');

userRouter.get('/api/users', function (req, res) {
    let user = decodeToken(req, res);
    User.findAndCountAll({
        attributes:['id','name','isAdmin','email','enterpriseId','createdAt'],
        where:{enterpriseId: user.enterpriseId},
        order: [['updatedAt', 'DESC']]
    }).then((data)=>{
        res.json(new Result({users: data.rows, totalPages: data.count}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

userRouter.get('/api/allUsers', function (req, res) {
    let user = decodeToken(req, res);
    userService.allUserOfEnterprise(user.enterpriseId).then(data=>res.json(new Result(data))).catch(error=>res.json(new Result(error.message, false)));
});

userRouter.get('/api/allUsersOfProduct', function (req, res) {
    Team.findAll({
        attributes:['id','name','isAdmin','email','enterpriseId','createdAt'],
        include: [{
            attributes: ['id','name'],
            model: User,
            as: 'user'
        }],
        where: { productId: req.query.productId }
    }).then((data)=>{
        let userIds = data.map(team => team.userId);
        res.json(new Result(userIds));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let hasPermission = function (req, res) {
    return new Promise((resolve, reject)=>{
        let user = decodeToken(req, res);
        if(!user.isAdmin){
            res.json(new Result("您没有权限!", false));
        }else{
            resolve(user);
        }
    })
};

/**
 * 添加用户
 */
userRouter.post('/api/user', function (req, res) {
    hasPermission(req, res).then((user)=>{
        userService.createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: false,
            enterpriseId: user.enterpriseId,
        }).then( data => res.json(new Result())).catch(error=>{
            res.json(new Result(error.message, false));
        });
    });
});

/**
 * 管理员修改用户
 */
userRouter.put('/api/user/:id(\\d+)', function (req, res) {
    hasPermission(req, res).then(()=>{
        User.update({
            name: req.body.name,
            email: req.body.email,
        }, { where: {id: req.body.id} }).then((data)=>{
            res.json(new Result());
        }).catch(error=>{
            console.log(error);
            res.json(new Result(error.message, false));
        });
    });
});

/**
 * 重置密码
 */
userRouter.put('/api/user/password', function (req, res) {
    let password = req.body.password;
    let rePassword = req.body.rePassword;

    if(password !== rePassword){
        res.json(new Result("两次密码不一致!", false));
    }else{
        hasPermission(req, res).then(()=>{
            userService.resetPassword(req.body.id, req.body.password).then(()=>{
                res.json(new Result());
            }).catch(error=> res.json(new Result(error.message, false)));
        });
    }
});

/**
 * 删除用户
 */
userRouter.delete('/api/user/:id', function (req, res) {
    hasPermission(req, res).then(()=>{
        User.destroy({
            where: { id: req.params.id }
        }).then((data)=>{
            res.json(new Result());
        }).catch(error=>{
            console.log(error);
            res.json(new Result(error.message, false));
        });
    });
});

/**
 * 获取个人信息
 */
userRouter.get('/api/user/info', function (req, res) {
    let user = decodeToken(req, res);

    User.findById(user.id).then((user)=>{
        showEnterprise(user.enterpriseId).then(data=> {
            res.json(new Result({
                id: user.id,
                name: user.name,
                email: user.email,
                enterpriseName: data.name,
            }));
        }).catch(error => res.json(new Result(error.message, false)));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

let showEnterprise = function (id) {
    return new Promise((resolve, reject)=>{
        Enterprise.findById(id).then(data=> resolve(data)).catch(error=> {
            console.log(error);
            reject(error)
        });
    });
};

/**
 * 修改个人信息
 */
userRouter.put('/api/user/info', function (req, res) {
    let user = decodeToken(req, res);
    User.update({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    },{
        where: { id: user.id }
    }).then((user)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

/**
 * 登录
 */
userRouter.post('/api/login', function (req, res) {
    User.findOne({
        where: {
            $or: [{
                name: req.body.loginName
            },{
                email: req.body.loginName
            }]
        }
    }).then((user)=>{
        if(user == null){
            res.json(new Result("用户名或密码不正确!", false));
        }else{
            if(userService.isSame(req.body.password, user.password)){
                res.json(new Result(generateToken(user)));
            }else{
                res.json(new Result("用户名或密码不正确!", false));
            }
        }
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

userRouter.post('/api/user/register', function (req, res) {
    Enterprise.create({
        name: req.body.user.enterprise
    }).then(enterprise=>{
        let user = req.body.user;
        user.enterpriseId = enterprise.id;
        user.isAdmin = true;
        userService.createUser(user).then(user => res.json(new Result(generateToken(user)))).catch(error=>res.json(new Result(error.message, false)));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

module.exports = userRouter;