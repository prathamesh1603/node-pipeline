const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const ProductCategory = require("../models/ProductCategory");
const User = require("../models/User");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getAllWithAggregation } = require("../utils/Modelfactory/factory");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.dynamicPopulateMiddleware = catchAsync(async (req, res, next) => {
  const lookupStage = [];

  if (req.query.populate) {
    const populateFields = req.query.populate.split(",");
    const selectFields = req.query.selectPopulateField
      ? req.query.selectPopulateField.split(",")
      : null;

    populateFields.forEach((field) => {
      let lookupConfig = {};

      if (field === "ofCompany") {
        lookupConfig = {
          from: "companies",
          localField: "ofCompany",
          foreignField: "_id",
          as: "ofCompany",
          pipeline: selectFields
            ? [
                {
                  $project: selectFields.reduce((acc, f) => {
                    acc[f.trim()] = 1; // Include only selected fields
                    acc["_id"] = 1; // Optionally exclude/include '_id'
                    return acc;
                  }, {}),
                },
              ]
            : [],
        };
      } else if (field === "timeline") {
        lookupConfig = {
          from: "timelines",
          localField: "timeline",
          foreignField: "_id",
          as: "timeline",
          pipeline: selectFields
            ? [
                {
                  $project: selectFields.reduce((acc, f) => {
                    acc[f.trim()] = 1;
                    acc["_id"] = 0;
                    return acc;
                  }, {}),
                },
              ]
            : [],
        };
      } else if (field === "assignedTo") {
        lookupConfig = {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
          pipeline: selectFields
            ? [
                {
                  $project: selectFields.reduce((acc, f) => {
                    acc[f.trim()] = 1;
                    acc["_id"] = 0;
                    return acc;
                  }, {}),
                },
              ]
            : [],
        };
      } else {
        return;
      }

      lookupStage.push(
        { $lookup: lookupConfig },
        {
          $addFields: {
            [field]: { $arrayElemAt: [`$${field}`, 0] }, // Convert array to single object
          },
        }
      );
    });

    req.lookupStage = lookupStage; // Attach lookup stages to request object
  }

  next();
});

exports.userPopulateMiddleware = catchAsync(async (req, res, next) => {
  if (req.user.ofCompany) {
    req.middlewarePipeline = [
      {
        $match: {
          ofCompany: new ObjectId(req.user.ofCompany),
        },
      },
    ];
    delete req.query.ofCompany;
  } else {
    if (!req?.query?.ofCompany) {
      return next(new appError("please pass company id", 400));
    }

    // Define the fields you want to check dynamically
    const filterFields = ["ofCompany", "assignedTo", "anotherField"]; // Add any other fields you want to check

    // Initialize the middleware pipeline
    req.middlewarePipeline = [];

    // Iterate over the fields to dynamically build the $match stages
    filterFields.forEach((field) => {
      if (req?.query?.[field]) {
        req.middlewarePipeline.push({
          $match: {
            [field]: new ObjectId(req.query[field]),
          },
        });
        // Delete the query field to clean up the request
        delete req.query[field];
      }
    });
  }

  next();
});

exports.getLeadAnlytics = getAllWithAggregation(Lead);
exports.getDealAnalytics = getAllWithAggregation(Deal);
exports.getProductAnaltics = getAllWithAggregation(ProductCategory);
exports.getUserAnalytics = getAllWithAggregation(User);
