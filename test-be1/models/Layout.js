const mongoose = require("mongoose");

const layoutSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
    },
    ofCompany: {
      type: mongoose.mongo.ObjectId,
      ref: "Company",
    },
    fields: [
      {
        groupName: String,
        groupFields: [
          {
            label: {
              type: String,
            },
            type: {
              type: String,
            },
            options: [String],
            required: {
              type: Boolean,
            },
            rolePermission: [Object],

            column: {
              type: Number,
              default: 1,
            },
          },
        ],
      },
    ],

    updatedBy: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Layout = mongoose.model("Layout", layoutSchema);

module.exports = Layout;
