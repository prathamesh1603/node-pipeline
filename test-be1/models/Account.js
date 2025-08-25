const mongoose = require("mongoose");

const { v4: uuidv4 } = require("uuid");

const accountSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    dealsDetails: {
      type: [mongoose.mongo.ObjectId],
      ref: "Deal",
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

const Accounts = mongoose.model("Account", accountSchema);

module.exports = Accounts;
