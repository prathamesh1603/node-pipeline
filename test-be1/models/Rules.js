const mongoose = require("mongoose");

const { v4: uuidv4 } = require("uuid");

const ruleSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },

    ofCompany: {
      type: mongoose.mongo.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

const Rules = mongoose.model("Rules", ruleSchema);

module.exports = Rules;
