var Sequelize = require("sequelize");
var sequelize = require("../../infrastructure/repository/index");
var User = require("./User");
var moment = require('moment');

let SprintBacklog = sequelize.define('sprint_backlog', {
    name: { type: Sequelize.STRING },
    importance: { type: Sequelize.INTEGER },
    story: { type: Sequelize.STRING },
    demo: { type: Sequelize.STRING },
    note: { type: Sequelize.STRING },
    estimate: { type: Sequelize.FLOAT },
    userId: { type: Sequelize.INTEGER },
    progress: { type: Sequelize.INTEGER },
    updatedDate: { type: Sequelize.DATE },
    startDate: {
        type: Sequelize.DATE,
        get: function()  {
            let startDate = this.getDataValue('startDate');
            return startDate!=null ? moment(startDate).format("YYYY-MM-DD HH:mm:ss"): null;
        }
    },
    endDate: {
        type: Sequelize.DATE,
        get: function()  {
            let endDate = this.getDataValue('endDate');
            return endDate!=null ? moment(endDate).format("YYYY-MM-DD HH:mm:ss"): null;
        }
    },
    sprintId: { type: Sequelize.INTEGER },
});

SprintBacklog.belongsTo(User);

module.exports =  SprintBacklog;