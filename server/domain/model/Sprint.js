/**
 * Created by sunlong on 16/7/10.
 */
var moment = require('moment');
var Sequelize = require("sequelize");
var db = require("../../infrastructure/repository/index");
var Product = require("./Product");
var User = require("./User");

let Sprint = db.define('sprint', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    planningEndDate: {
        type: Sequelize.DATE,
        get: function()  {
            let planningEndDate = this.getDataValue('planningEndDate');
            return planningEndDate!=null?moment(planningEndDate).format("YYYY-MM-DD HH:mm:ss"):null;
        },
    },
    endDate: {
        type: Sequelize.DATE,
        get: function()  {
            let endDate = this.getDataValue('endDate');
            return endDate!=null?moment(endDate).format("YYYY-MM-DD HH:mm:ss"):null;
        },
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: Sequelize.DATE,
        get: function()  {
            let startDate = this.getDataValue('startDate');
            return startDate!=null?moment(startDate).format("YYYY-MM-DD HH:mm:ss"):null;
        },
        allowNull: false,
    },
    productId: {
        type: Sequelize.INTEGER ,
        allowNull: false,
    },
},{
    validate:{
        isAfterStartDate: function(){
            if(this.planningEndDate!=null && moment(this.planningEndDate).isBefore(this.startDate)){
                throw new Error("计划结束时间不能早于开始时间!");
            }
            if(this.endDate!=null && moment(this.endDate).isBefore(this.startDate)){
                throw new Error("结束时间不能早于开始时间!");
            }
        }
    }
});

Sprint.belongsTo(Product);
Sprint.belongsTo(User);

module.exports =  Sprint;