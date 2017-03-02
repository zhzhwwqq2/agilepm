/**
 * Created by sunlong on 16/8/13.
 */
var Sequelize = require("sequelize");
var sequelize = require("../../infrastructure/repository/index");

let Post = sequelize.define('post', {
    progress: { type: Sequelize.INTEGER },
    sprintBacklogId: { type: Sequelize.INTEGER },
    updatedDate: { type: Sequelize.DATE },
});

module.exports =  Post;