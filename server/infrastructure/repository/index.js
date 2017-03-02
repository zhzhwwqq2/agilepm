var Sequelize = require("sequelize");
var sequelize = new Sequelize('mysql://admin:abcd1234@localhost:33066/agilepm');
//var sequelize = new Sequelize('agilepm','caoym','myworld,.?',{dialect:'mysql', host:'127.0.0.1'});

module.exports = sequelize;