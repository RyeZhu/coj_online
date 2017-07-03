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
        uri: process.env.MONGO_URL,
    },
};

module.exports = config;