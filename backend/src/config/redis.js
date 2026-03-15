const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisUrl = process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL;

const redisConfig = redisUrl ? redisUrl : {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    maxRetriesPerRequest: null
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
    logger.info('Redis connection established successfully.');
});

let connectionErrorLogged = false;
redisClient.on('error', (err) => {
    if (!connectionErrorLogged) {
        logger.error(`Redis connection error: ${err.message || err}. Suppressing further connection errors.`);
        connectionErrorLogged = true;
    }
});

module.exports = redisClient;
