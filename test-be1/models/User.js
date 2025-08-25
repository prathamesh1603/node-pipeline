const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Company = require("./Company");
const { v4: uuidv4 } = require("uuid");
const Role = require("./Role");
const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    name: {
      type: String,
      required: [true, "Name of user ?"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email of user ?"],
      unique: [true, "provided email already in use"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "must have password"],
      trim: true,
      select: false,
    },
    autoGenratedPassword: {
      type: Boolean,
      default: true,
    },
    role: {
      type: mongoose.mongo.ObjectId,
      ref: "Role",
      required: [true, "must have role of user"],
    },
    ofCompany: {
      type: mongoose.mongo.ObjectId,
      ref: "Company",
      required: [true, "must provide company to user"],
    },

    mobile: {
      type: String,
      unique: [true, "this phone number already exist"],
      required: [true, "must provide mobile number"],
      trim: true,
    },
    address: {
      type: Object,
    },
    passwordChangedAt: Date,
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
    reportingManager: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
    employeeCode: {
      type: String,
    },
    department: {
      type: String,
    },
    joiningDate: {
      type: String,
    },

    agentId: {
      type: String,
    },
    campaignName: {
      type: String,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  const previousStatus = this.getUpdate().$set?.status;

  const userId = doc._id;
  let role = await Role.findById(doc.role);

  if (previousStatus && role.name == "caller") {
    const company = await Company.findOne(doc.ofCompany); // Update this logic for your specific query
    if (company.distributeFrom == userId) {
      let nextId = company.activeCaller.at(
        company.activeCaller.indexOf(company.distributeFrom) + 1
      );

      if (Boolean(nextId)) {
        company.distributeFrom = company.activeCaller.at(
          company.activeCaller.indexOf(company.distributeFrom) + 1
        );
      } else {
        company.distributeFrom = company.activeCaller[0];
      }
    }
    if (previousStatus === "active") {
      // Add user to activeCaller if not already present
      if (!company.activeCaller.includes(userId)) {
        company.activeCaller.push(userId);
        await company.save();
      }
    } else if (previousStatus === "inactive") {
      // Remove user from activeCaller
      company.activeCaller = company.activeCaller.filter(
        (callerId) => !callerId.equals(userId)
      );
      await company.save();
    }
  }
});

userSchema.methods.correctPass = async function (inputpassword, password) {
  let t = await bcrypt.compare(inputpassword, password);

  return t;
};
userSchema.methods.changedPasswords = async function (jwttokentime) {
  if (this.changedPasswodTime) {
    const change = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return jwttokentime < change;
  }

  // if user has not change the password at least once
  return false;
};

module.exports = mongoose.model("User", userSchema);
