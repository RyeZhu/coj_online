/**
 * Created by m on 16/06/2017.
 */
let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let nodeRestClient = require('node-rest-client').Client;
let restClient = new nodeRestClient();

console.log('EXECUTE_SERVER_URL:' + process.env.EXECUTE_SERVER_URL.green);
restClient.registerMethod('buildAndRun', process.env.EXECUTE_SERVER_URL, 'POST');

let problemService = require('../services/problemService');

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
        .then(problems => res.json(problems))
        .catch(error => console.error(error));
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
    let id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

router.post('/build_and_run', jsonParser, function (req, res) {
    const language = req.body.language.toLowerCase();
    const code = req.body.code;

    console.log(('build_and_run: ' + language + ' ' + code).green);

    restClient.methods.buildAndRun({
        data: {code: code, language: language},
        headers: {"Content-Type": "application/json"}
    }, (data, response) => {
        console.log('Received from execution server. ' + response);
        // console.log('Received from execution server. ' + data);
        const text = `Build output ${data['build']}
        Execute output: ${data['run']}`;

        console.log(text);
        data['text'] = text;
        res.json(data);
    });

    // let result = {"text": "Hello World!!"};
    // res.json(result);
});

module.exports = router;