const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const companySchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    name: {
      type: String,
      required: [true, "please provide name of company"],
    },
    code: {
      type: String,
      unique: [true, "code must be unique"],
      required: [true, "please provide code of company"],
    },
    logo: {
      type: String,
      // required: [true,"please provide logo of company"],
    },
    website: {
      type: String,
    },
    rating: {
      type: Number,
    },
    tags: {
      type: [String],
    },
    industry: {
      type: String,
    },
    address: {
      type: Object,
    },
    socialProfiles: {
      type: [String],
    },

    email: {
      type: String,
      require: [true, "please provide email of company"],
      unique: true,
    },
    mobile: {
      type: String,
      require: [true, "please provide contact number of company"],
    },
    assignedTo: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
    caller: {
      type: [mongoose.mongo.ObjectId],
      ref: "User",
    },
    distributeFrom: {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "inactive",
    },
    activeCaller: {
      type: [mongoose.mongo.ObjectId],
      ref: "User",
    },
    leadContactStage: {
      type: [Object],
      default: [
        {
          name: "Not Started",
          id: 1,
          color: "#1f1f1f", // Dark grayish black
        },
        {
          name: "Follow-Up",
          color: "#8b8b8b", // Muted dark gray
          id: Date.now() + 1,
          toDeal: false,
        },
        {
          name: "Click To Call",
          color: "#006400", // Dark green
          id: Date.now() + 2,
          toDeal: false,
        },
        {
          name: "Connected",
          color: "#1a237e", // Deep indigo
          id: Date.now() + 3,
          toDeal: false,
        },
        {
          name: "Not Connected",
          color: "#4a148c", // Dark purple
          id: Date.now() + 4,
          toDeal: false,
        },
        {
          name: "interested",
          color: "#b71c1c", // Dark red
          id: Date.now() + 5,
          toDeal: false,
        },
        {
          name: "Not Interested",
          color: "#0d47a1", // Dark blue
          id: Date.now() + 6,
          toDeal: false,
        },
        {
          name: "Qualified",
          color: "#212121", // Very dark gray
          id: Date.now() + 7,
          toDeal: true,
        },
      ],
    },

    dealContactStage: {
      type: [Object],
      default: [
        {
          name: "Not Started",
          id: 1,
          color: "#1f1f1f", // Dark grayish black
        },
        {
          name: "Close Won",
          color: "#28f425",
          id: Date.now() + 1,
          dealWon: true,
          dealLost: false,
        },
        {
          name: "Close Lost",
          color: "#12d9a7",
          id: Date.now() + 2,
          dealWon: false,
          dealLost: true,
        },
      ],
    },
    dealConvertStage: {
      type: String,
    },

    // ozonetel details
    ozonetelApiKey: {
      type: String,
    },
    ozonetelUsername: {
      type: String,
    },
    ozonetelcampaignName: {
      type: [String],
    },
    departments: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

companySchema.pre("save", function (next) {
  if (!this.isModified("ozonetelApiKey")) return next();

  const ENCRYPTION_KEY = Buffer.from(
    process.env.ENCRYPTION_KEY_OZENTEL_API_KEY,
    "base64"
  ); // 32-byte key for AES-256
  // const ENCRYPTION_KEY = crypto.randomBytes(32); // 32-byte key for AES-256
  // console.log(
  //   ENCRYPTION_KEY,
  //   "   ",
  //   process.env.ENCRYPTION_KEY_OZENTEL_API_KEY
  // );

  const IV_LENGTH = 16;

  function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted; // Combine IV and encrypted text
  }

  this.ozonetelApiKey = encrypt(this.ozonetelApiKey); // Encrypt the API key
  next();
});

companySchema.post(/^findOne/, function (doc) {
  if (!doc) return; // Exit if no document is found

  const ENCRYPTION_KEY = Buffer.from(
    process.env.ENCRYPTION_KEY_OZENTEL_API_KEY,
    "base64"
  );
  const IV_LENGTH = 16;

  function decrypt(text) {
    if (!text) return null;
    const parts = text.split(":");
    if (parts.length !== 2) return text; // Return original if format is invalid
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  if (doc.ozonetelApiKey) {
    doc.ozonetelApiKey = decrypt(doc.ozonetelApiKey); // Decrypt and set in the document
  }
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
