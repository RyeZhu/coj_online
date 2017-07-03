/**
 * Created by m on 16/06/2017.
 */
var express = require('express');
var app = express();
var config = require('./config');

var path = require('path');

var mongoose = require('mongoose');
mongoose.connect(config.db.uri);

var indexRouter = require('./route/index');
var restRouter = require('./route/rest');

app.use(express.static(path.join(__dirname, '../public/')));

app.use('/', indexRouter);

app.use('/api/v1/', restRouter);


// define the home page route
app.use(function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

app.listen(3000, function () {
    console.log('OJ app listening on port 3000!')
});