/**
 * Created by m on 16/06/2017.
 */

var ProblemModel = require('../models/problemModel');


/**
 * 显示出所有的题目
 * @returns {Promise}
 */
var getProblems = function () {
    console.log('getProblems');

    return new Promise((resolv, reject) => {
        ProblemModel.find({}, function (error, problems) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolv(problems);
            }
        });
    });
};

/**
 * 得到题目具体内容
 * @param id
 * @returns {Promise}
 */
var getProblem = function (id) {
    return new Promise((resolv, reject) => {
        ProblemModel.findOne({id: id}, function (error, problem) {
            if (error) {
                reject(error);
            } else {
                resolv(problem);
            }
        });
    });
};

/**
 * 添加新的题目
 * @param newProblem
 * @returns {Promise}
 */
var addProblem = function (newProblem) {



    console.warn(newProblem);
    return new Promise((resolv, reject) => {
        ProblemModel.findOne({name: newProblem.name}, function (error, problem) {
            if (problem) {
                reject("Problem alreay exist!");
            } else {
                ProblemModel.count({}, function (error, num) {
                    newProblem.id = num + 1;
                    console.log(newProblem);
                    var mongoProblem = new ProblemModel(newProblem);
                    console.log(mongoProblem);
                    mongoProblem.save(function (err) {
                        if (err) console.log(err);
                    });
                    resolv(newProblem);
                });
            }
        });
    });
};

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
};

