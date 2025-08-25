const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    name: {
      type: String,
      required: [true, "Name of role ?"],
      trim: true,
    },
    control: {
      type: Object,
      default: {
        dashboard: [],
        accounts: [],
        companies: [],
        users: [],
        deals: [],
        leads: [],
        roles: [],
        products: [],
        stages: [],
        reports: [],
        customModules: [],
        settings: [],

        // create update read delete
      },
    },
    readVisibility: {
      type: Object,
      default: {
        dashboard: "own",
        accounts: "own",
        companies: "own",
        users: "own",
        deals: "own",
        leads: "own",
        roles: "own",
        products: "own",
        stages: "own",
        reports: "own",
        customModules: "own",

        // own company team assigned everything
      },
    },
    createdBy: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.pre("save", function (next) {
  if (this.isNew) {
    // Only set 'createdAt' if the document is new
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  next();
});

// Post-update middleware: Set 'updatedAt'
roleSchema.post(["updateOne", "findOneAndUpdate"], async function (doc, next) {
  const now = new Date();

  doc.updatedAt = now;
  await doc.save(); // Save the updated doc

  next();
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
