/**
 * Created by sunlong on 16/8/11.
 */
var jwt = require('jsonwebtoken');
var Result = require("../../infrastructure/common/Result");

let decodeToken = function(req, res){
    let token = req.header('Authorization').split(' ')[1];
    if(token == null || token=='null'){
        token = req.query.access_token;
        if(token == null || token=='null'){
            res.json(new Result("session过期,请重新登录", false));
        }
    }
    return jwt.verify(token, 'agilepmcaoym08');
};

let generateToken = function (user) {
    return jwt.sign({ id: user.id, name:user.name, date: new Date().getMilliseconds(), enterpriseId: user.enterpriseId, isAdmin: user.isAdmin }, 'agilepmcaoym08');
};

module.exports = {
    decodeToken: decodeToken,
    generateToken: generateToken
};