const ProductCategory = require("../models/ProductCategory");

const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  updateOne,
  getAll,
  getOne,
} = require("../utils/Modelfactory/factory");

exports.createProductMiddleware = catchAsync(async (req, res, next) => {
  const { name, ofCompany, products } = req.body;

  req.body = {
    name,
    ofCompany: req?.user?.ofCompany || ofCompany,
    products,
    createdBy: req.user._id,
  };

  next();
});
exports.createProduct = createOne(ProductCategory);

exports.updateProductMiddleware = catchAsync(async (req, res, next) => {
  const { product } = req.body;
  if (product && product?.name) {
    let query = { $push: { products: product } };
    req.body = { ...query, updatedBy: req.user._id };
  }

  next();
});

exports.updateProduct = updateOne(ProductCategory);

exports.getAllProduct = getAll(ProductCategory);

exports.getProductById = getOne(ProductCategory);
