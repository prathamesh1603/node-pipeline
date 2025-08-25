const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const productCategorySchema = mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Automatically generate a UUID
      unique: true, // Ensure it's unique
    },
    name: {
      type: String,
    },
    ofCompany: {
      type: mongoose.mongo.ObjectId,
      ref: "Company",
    },
    products: {
      type: [
        {
          name: String,
          id: {
            type: Number,
            default: Date.now(),
          },
        },
      ],
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

productCategorySchema.pre("save", function (next) {
  if (this.isNew) {
    // Only set 'createdAt' if the document is new
    this.createdAt = new Date();
  }
  next();
});

// Post-update middleware: Set 'updatedAt'
productCategorySchema.post(
  ["updateOne", "findOneAndUpdate"],
  async function (doc, next) {
    const now = new Date();

    doc.updatedAt = now;
    await doc.save(); // Save the updated doc

    next();
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

module.exports = ProductCategory;
