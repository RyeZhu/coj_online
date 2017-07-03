/**
 * Created by m on 16/06/2017.
 */
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var problemService = require('../services/problemService');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

/**
 * define the home page route
 */
router.get('/problems', function (req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

/**
 * post a problem to database mongo
 */
router.post('/problems', jsonParser, function (req, res) {
    //console.dir(req.body);
    problemService.addProblem(req.body)
        .then(function (problem) {
            res.json(problem).send();
        }, function (error) {
            res.status(400).send("Problem already exist!");
        });
});

/**
 * rest for get problem detail
 */
router.get('/problem/:id', function (req, res) {
    var id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

module.exports = router;