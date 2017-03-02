/**
 * Created by sunlong on 16/7/10.
 */

var Sequelize = require("sequelize");
var db = require("../../infrastructure/repository/index");

let Team = db.define('team', {
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
});

module.exports =  Team;