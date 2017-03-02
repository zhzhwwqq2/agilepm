/**
 * Created by sunlong on 16/7/10.
 */
var express = require('express');
var enterpriseRouter = express.Router();
var Enterprise = require("../../domain/model/Enterprise");
var User = require("../../domain/model/User");
var userService = require("../service/userService");
var Result = require("../../infrastructure/common/Result");

enterpriseRouter.get('/api/enterprises', function (req, res) {
    Enterprise.findAndCountAll({
        include: [{
            model: User,
            as: "users",
            where:{isAdmin: true}
        }],
    }).then((data)=>{
        res.json(new Result({enterprises: data.rows, totalPages: data.count}));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

enterpriseRouter.post('/api/enterprise', function (req, res) {
    Enterprise.create({
        name: req.body.name,
    }).then((enterprise)=>{
        userService.createUser({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isAdmin: true,
            enterpriseId: enterprise.id
        }).then(user=> res.json(new Result())).catch(error=> res.json(new Result(error.message, false)));
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

enterpriseRouter.put('/api/enterprise/:id', function (req, res) {
    Enterprise.update({
        name: req.body.name,
    }, { where: {id: req.body.id} }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

enterpriseRouter.delete('/api/enterprise/:id', function (req, res) {
    Enterprise.destroy({
        where: { id: req.params.id }
    }).then((data)=>{
        res.json(new Result());
    }).catch(error=>{
        console.log(error);
        res.json(new Result(error.message, false));
    });
});

module.exports = enterpriseRouter;