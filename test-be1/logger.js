const { createLogger, format, transports } = require("winston");
const mongoose = require("mongoose");
const ErrorLog = require("./models/Error"); // Ensure the correct path to your ErrorLog model

const { combine, timestamp, json, colorize, printf } = format;

// Custom console logging format
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
    // new transports.File({ filename: "service/logger/error.log" }),
    // Custom MongoDB transport for error-level logs
    new transports.Http({
      level: "error",
      format: combine(
        json(),
        timestamp(),
        printf(({ level, message, timestamp, stack, context }) => {
          // Custom format for MongoDB logging
          const logData = {
            message,
            level,
            stack,
            context,
            timestamp,
          };
          // Call MongoDB save function when error-level log occurs
          logErrorToDatabase(logData);
          return JSON.stringify(logData); // Ensure the output is in a string format
        })
      ),
      // You can use a URL for API endpoints that would store the logs
      // For now, assume that we're logging directly to MongoDB
      host: "http://localhost", // Use a custom API if needed, or database directly
      path: "/logs",
    }),
  ],
});

// Function to save error logs to MongoDB
async function logErrorToDatabase(log) {
  try {
    const errorLog = new ErrorLog({
      message: log.message,
      level: log.level,
      stack: log.stack || null,
      context: log.context || {},
      timestamp: log.timestamp || new Date(),
    });
    await errorLog.save();
  } catch (err) {
    console.error("Failed to save log to database:", err);
  }
}

module.exports = logger;
