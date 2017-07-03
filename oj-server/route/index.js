var express = require('express');
var router = express.Router();
var path = require('path');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});
// define the home page route
router.get('/', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../../public/')});
});

module.exports = router;