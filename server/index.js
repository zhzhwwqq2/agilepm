var express = require('express');
var path = require('path');
var cors = require('cors');
var backlogRouter = require('./application/router/backlog');
var productRouter = require('./application/router/product');
var sprintRouter = require('./application/router/sprint');
var userRouter = require('./application/router/user');
var sprintBacklogRouter = require('./application/router/sprintBacklog');
var enterpriseRouter = require('./application/router/enterprise');
var progressRouter = require('./application/router/progress');
var bodyParser = require('body-parser');
var app = express();

app.set('port', process.env.PORT || 3000);
var corsOptions = {
    origin: 'http://localhost:8080'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use([backlogRouter, productRouter, sprintRouter, userRouter, sprintBacklogRouter, enterpriseRouter, progressRouter]);

// 定制404页面
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// 定制 500 页面
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});