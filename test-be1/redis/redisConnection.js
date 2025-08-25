const Redis = require('ioredis');

const redisClient = new Redis({
  host: 'localhost', 
  port: 6379,        
  // password
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redisClient;
