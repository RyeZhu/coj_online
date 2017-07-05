/**
 * Created by m on 16/06/2017.
 */
const config = {
    name: 'API',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 27982,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        old_uri: process.env.MONGO_MLAB,
        uri: process.env.MONGO_URL,
        options: {
            db: {native_parser: true},
            server: {poolSize: 5},
            replset: {rs_name: 'myReplicaSetName'},
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASS
        },
    },
};

module.exports = config;