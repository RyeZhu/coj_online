/**
 * Created by m on 22/06/2017.
 */

/**
 *socket handshake message
 `
 {
     headers:{
         host: 'localhost:3000',
         connection: 'keep-alive',
         pragma: 'no-cache',
         'cache-control': 'no-cache',
         accept: '*\/*',
         'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
         referer: 'http://localhost:3000/problems/1',
         'accept-encoding': 'gzip, deflate, br',
         'accept-language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2',
         cookie: '_ga=GA1.1.220468798.1485434273; Webstorm-3bae5060=b5982464-f25c-4446-aef8-4add99aa7c7e; Phpstorm-45ddebbc=4138e6b3-24c5-46f2-8460-d4c504f753e6; Phpstorm-45ddef7b=38f0a8d5-8f36-4e3b-8366-7e016d6e45d5; Webstorm-3bae541f=8719353b-cd7b-4797-928e-0c4bc5e08221; _xsrf=2|3d7eaaa5|3eacd868dfd3e082e575cc829f4377b9|1496488740; username-localhost-8888="2|1:0|10:1496998331|23:username-localhost-8888|44:MWFiMjBkODhhMjVmNDMwMGJiZGIyYTQyY2RiMDIzMTQ=|c0337cb39dcff4c128bf2cab7c297f47e70032d70f81dc13181c529a7af586a7"; io=-cM12p_ILcdhxUzMAAAB',
         socketlog: 'SocketLog(tabid=13&client_id=)'
     },
     time: 'Thu Jun 22 2017 16:31:24 GMT+0800 (CST)',
     address: '::1',
     xdomain: false,
     secure: false,
     issued: 1498120284882,
     url: '/socket.io/?message=123&EIO=3&transport=polling&t=LpExMge',
     query: { message: '123', EIO: '3', transport: 'polling', t: 'LpExMge' }
 }`;
 */
/**
 * socket.io for editors collaboration
 * @param io
 */

let codeDelegate = require('../modules/codeDelegate');

let redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

// codeDelegate.getCodeValue();

module.exports = function (io) {
    //collaboration sesssion
    let collaborations = [];
    //map from socketId to sessionId
    let socketIdToSessionId = [];
    //change buffer path in redis storage
    let sessionPath = '/temp_sessions';

    io.on('connection', (socket) => {
        /**
         * on receive connect event
         */

            //1. receive client sessionId params on connect
        let sessionId = socket.handshake.query['sessionId'];
        let problemId = socket.handshake.query['problemId'];
        let language = socket.handshake.query['language'];
        console.log("received sessionId:", sessionId);
        console.log("received problemId:", problemId);
        console.log("received language:", language);

        //2. storage socketId to sessionId map to memory
        socketIdToSessionId[socket.id] = sessionId;

        //3. storage socketId to sessionId map to redis
        if (sessionId in collaborations) {
            //4. push socketId to collaboration
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            let key = getEventKey(sessionId);
            redisClient.get(key, function (res) {
                if (res) {
                    //5. get sessionInfo from Redis Server
                    console.log("session terminated previsouly; pulling back from Redis.");
                    collaborations[sessionId] = {
                        'cacheChangeEvents': JSON.parse(res),
                        'cacheCursorEvents': {},
                        'participants': [],
                        'problem': {
                            problemId: problemId,
                            language: language
                        }
                    };
                } else {
                    //6. create new sessionInfo and storage to Redis Server
                    collaborations[sessionId] = {
                        'cacheChangeEvents': [],
                        'cacheCursorEvents': {},
                        'participants': [],
                        'problem': {
                            problemId: problemId,
                            language: language
                        }
                    };
                }
                //7. push socketId to collaboration
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }//end if (sessionId in collaborations)

        //////////////////////////////
        //end socket.on('connection')
        //////////////////////////////

        /**
         * on receive change event
         */
        socket.on('change', delta => {
            console.log("change " + socketIdToSessionId[socket.id] + " " + delta);
            let sessionId = socketIdToSessionId[socket.id];

            ///1. save move buffer
            if (sessionId in collaborations) {
                collaborations[sessionId]['cacheChangeEvents'].push(['change', delta, Date.now()]);
            }

            ///2. save 1 snapshot + 10 code change
            // let cacheChangeEvents = collaborations[sessionId]['cacheChangeEvents'];
            // let result = codeDelegate.getCodeValue(cacheChangeEvents);
            // console.log(result);

            ///2. forward string to client
            forwardEvent(socket.id, 'change', delta);
        });//end socket.on('change')

        /**
         * on receive cursorMove event
         */
        socket.on('cursorMove', cursor => {
            console.log('cursor move sessionId: ' + socketIdToSessionId[socket.id] + ' ' + cursor);

            ///1. unpack cursor and add socketId to cursor
            cursor = JSON.parse(cursor);
            cursor.socketId = socket.id;
            cursor = JSON.stringify(cursor);

            ///2. record last cursor status on server
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cacheCursorEvents'][socket.id] = cursor;
            }

            ///2. forward string to client
            forwardEvent(socket.id, 'cursorMove', cursor);
        });//end socket.on('cursorMove')

        /**
         * on receive restoreBuffer event
         */
        socket.on('restoreBuffer', () => {
            console.log('restore change buffer sessionId: ' + socketIdToSessionId[socket.id]);
            let sessionId = socketIdToSessionId[socket.id];

            if (sessionId in collaborations) {
                ///0. send last snapshot
                let problem = collaborations[sessionId]['problem'];
                console.dir(problem);
                socket.emit('snapshot', codeDelegate.getCodeSnap(problem.language));

                ///1. read move buffer
                let changeEvents = collaborations[sessionId]['cacheChangeEvents'];
                let cursorEvents = collaborations[sessionId]['cacheCursorEvents'];

                ///2. emit change event to client
                console.log('restore change events.');
                for (let i = 0; i < changeEvents.length; ++i) {
                    //io.to(socket.id).emit(changeEvents[i][0], changeEvents[i][1]);
                    socket.emit(changeEvents[i][0], changeEvents[i][1]);
                }

                ///3. init cursor status
                for (let socketId in cursorEvents) {
                    // skip loop if the property is from prototype
                    if (!cursorEvents.hasOwnProperty(socketId)) continue;
                    if (socketId === socket.id) continue;
                    console.log('restore cursorMove event: ' + cursorEvents[socketId]);
                    //forwardEvent(socket.id, 'cursorMove', cursorEvents[socketId]);
                    socket.emit('cursorMove', cursorEvents[socketId]);
                }

                console.log('end restore change buffer');
                console.log('');
            }
        });//end socket.on('restoreBuffer')

        /**
         * on receive disconnect event
         */
        socket.on('disconnect', () => {
            console.log('socketId: ' + socket.id + ' sessionId: ' + socketIdToSessionId[socket.id] + ' disconnect');
            let sessionId = socketIdToSessionId[socket.id];

            //1. remove session from collabroation
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let cursorEvents = collaborations[sessionId]['cacheCursorEvents'];
                let changeEvents = collaborations[sessionId]['cacheChangeEvents'];

                let index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);

                    //2. remove client cursor
                    if (cursorEvents.hasOwnProperty(socket.id)) {
                        forwardEvent(socket.id, 'cursorRemove', cursorEvents[socket.id]);
                        delete cursorEvents[socket.id];
                    }

                    //3. check participants is empty
                    if (participants.length === 0) {
                        console.log("last participant left. Storing to Redis");
                        let key = getEventKey(sessionId);
                        let value = JSON.stringify(changeEvents);

                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);

                        delete collaborations[sessionId];
                    }

                }///end if (index >= 0)

            }//end if (sessionId in collaborations)


        });//end socket.on('disconnect')

        /**
         * return key for storage k/v to redis
         * @param sessionId
         * @returns {string}
         */
        function getEventKey(sessionId) {
            return sessionPath + '/' + sessionId;
        }

        /**
         * forward message to client exclude received socket
         * @param socketId
         * @param eventName
         * @param dataString
         */
        function forwardEvent(socketId, eventName, dataString) {
            let sessionId = socketIdToSessionId[socketId];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; ++i) {
                    if (socket.id !== participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            } else {
                console.log("WARNNING: could not tie socket_id to any collaboration.");
            }
        }


        //io.to(socket.id).emit('message', 'sesssionId ' + sessionId + ', check it is right?');
        socket.emit('message', 'sesssionId ' + sessionId + ', check it is right?');
    });
};