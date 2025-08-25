const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema({
  message: String,
  level: String,
  stack: String,
  context: Object,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);

module.exports = ErrorLog;
