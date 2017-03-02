/**
 * Created by sunlong on 16/7/10.
 */

var Sequelize = require("sequelize");
var db = require("../../infrastructure/repository/index");

let User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    isAdmin: {type: Sequelize.BOOLEAN},
    enterpriseId: { type: Sequelize.INTEGER },
});

module.exports =  User;