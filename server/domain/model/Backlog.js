var Sequelize = require("sequelize");
var sequelize = require("../../infrastructure/repository/index");
var Sprint = require("../model/Sprint");

let Backlog = sequelize.define('backlog', {
    name: { type: Sequelize.STRING },
    importance: { type: Sequelize.INTEGER },
    story: { type: Sequelize.STRING },
    demo: { type: Sequelize.STRING },
    note: { type: Sequelize.STRING },
    productId: { type: Sequelize.INTEGER },
    sprintId: { type: Sequelize.INTEGER },
});

Backlog.belongsTo(Sprint, {as: 'sprint'});

module.exports =  Backlog;