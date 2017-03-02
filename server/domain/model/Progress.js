/**
 * Created by sunlong on 16/8/7.
 */
var Sequelize = require("sequelize");
var sequelize = require("../../infrastructure/repository/index");
var SprintBacklog = require("./SprintBacklog");

let Progress = sequelize.define('progress', {
    progress: { type: Sequelize.INTEGER },
    sprintBacklogId: { type: Sequelize.INTEGER },
    updatedDate: { type: Sequelize.DATE },
    sprintId: { type: Sequelize.INTEGER },
});

Progress.belongsTo(SprintBacklog, {as: 'sprintBacklog'});

module.exports =  Progress;