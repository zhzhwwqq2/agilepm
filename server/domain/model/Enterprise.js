/**
 * Created by sunlong on 16/8/5.
 */
var Sequelize = require("sequelize");
var db = require("../../infrastructure/repository/index");
var User = require("./User");

let Enterprise = db.define('enterprise', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Enterprise.hasMany(User, {as: 'users'});

module.exports =  Enterprise;