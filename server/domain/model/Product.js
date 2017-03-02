/**
 * Created by sunlong on 16/7/10.
 */

var Sequelize = require("sequelize");
var db = require("../../infrastructure/repository/index");
var User = require("./User");

let Product = db.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deleted:{type: Sequelize.BOOLEAN}
});

Product.belongsTo(User);

module.exports =  Product;