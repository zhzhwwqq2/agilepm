var Sequelize = require("sequelize");
var sequelize = new Sequelize('mysql://admin:abcd1234@localhost:33066/agilepm');

module.exports = sequelize;