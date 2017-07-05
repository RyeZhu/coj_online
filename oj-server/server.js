/**
 * Created by m on 16/06/2017.
 */

require('dotenv').load();
let express = require('express');
let app = express();
let config = require('./config');

let path = require('path');
let http = require('http');
let socket_io = require('socket.io');
let io = new socket_io();

let colors = require('colors');

// let socketServer =
require('./services/socketService')(io);

let mongoose = require('mongoose');
// mongoose.connect(config.db.uri);


console.log("mongo db: " + config.db.uri.green);
mongoose.connect(config.db.uri, config.db.options)
    .then(() => console.log('mongodb connect success'))
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

let indexRouter = require('./route/index');
let restRouter = require('./route/rest');

//1. init forest express to manage mongodb data
app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/models', // Your models directory.
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: require('mongoose') // The mongoose database connection.
}));

app.use(express.static(path.join(__dirname, '../public/')));
app.use('/', indexRouter);
app.use('/api/v1/', restRouter);

// define the home page route
app.use(function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});


let server = http.createServer(app);
io.attach(server);

server.listen(3000);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    throw error;
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe =' + addr
        : 'port = ' + addr.port;
    console.log(("listening on " + bind).underline.yellow);
}
