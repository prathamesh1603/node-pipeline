const redisClient = require("./redisConnection");

async function getRedisData(key) {
  try {
    const data = await redisClient.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    // console.error(`Error getting data from Redis for key ${key}:`, error);
    logger.error(`Error getting data from Redis for key ${key}:`, error);
    throw error;
  }
}

async function setRedisData(key, data) {
  try {
    await redisClient.set(key, JSON.stringify(data));

    logger.info(`Data set in Redis with key: ${key}`);
  } catch (error) {
    // console.error(`Error setting data in Redis for key ${key}:`, error);
    logger.error(`Error setting data in Redis for key ${key}:`, error);
    throw error;
  }
}

module.exports = { getRedisData, setRedisData };
