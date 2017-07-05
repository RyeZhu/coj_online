/**
 * Created by m on 23/06/2017.
 */
let redis = require('redis');


console.log('redis url:' + process.env.REDIS_HOST.green);

let redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
};
let client = redis.createClient(redisOptions);

// client.auth(process.env.REDIS_PASS, function (error, response) {
//     if (error) {
//         console.error(error);
//         return;
//     }
// });

function set(key, value, callback) {
    client.set(key, value, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }
        callback(response);
    });
}

function get(key, callback) {
    client.get(key, function (error, response) {
        if (error) {
            console.log(error);
            return;
        }
        callback(response);
    });
}

function expire(key, timeToExpireSeconds) {
    client.expire(key, timeToExpireSeconds);
}

function quit() {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print
};
