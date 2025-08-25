const { default: mongoose } = require("mongoose");
const User = require("../../models/User");
const Apifeature = require("../apiFeature");
const appError = require("../appError");
const catchAsync = require("../catchAsync");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({
      ...req.body,
    });
    if (!doc) {
      return next(
        new appError("failed to create doc please try again to create !!", 404)
      );
    }

    res.status(201).json({
      status: true,
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    Object.keys(req.query).forEach((key) => {
      if (!req.query[key]) {
        delete req.query[key];
      }
    });

    let features = new Apifeature(Model.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination()
      .populate();

    let doc = await features.query;
    let count = await features.totalResult.countDocuments();

    if (!doc) {
      return next(new appError("failed to get all the Doc !!", 404));
    }

    res.status(200).json({
      status: true,
      totalResult: count,
      data: doc,
    });
  });

exports.getAllByFilterOut = (Model) =>
  catchAsync(async (req, res, next) => {
    const ofProduct = req.params.reviewId;
    let features = new Apifeature(
      Model.find({
        ofProduct,
      }),
      req.query
    )
      .filter()
      .sort()
      .fields()
      .pagination();

    let doc = await features.query;

    if (!doc) {
      return next(new appError("failed to get all the Doc !!", 404));
    }

    res.status(200).json({
      status: true,
      totalResult: doc.length,
      data: doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let selectFields = req.query.selectPopulate?.split(",").join(" ") || "-__v";
    let path = req.query.populate?.split(",").join(" ");

    if (!req?.params?.id) {
      return next(new appError("Please pass the details.", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new appError("Invalid ObjectId format.", 400));
    }
    let doc;
    if (req.query?.populate) {
      doc = await Model.findById(req.params.id).populate({
        path: path,
        select: selectFields,
        strictPopulate: false, // Disable strict populate to avoid errors
      });
    } else {
      doc = await Model.findById(req.params.id);
    }

    if (!doc) {
      return next(new appError("unable to find data with detail  ", 400));
    }
    res.status(200).json({
      status: true,
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req?.params?.id) {
      return next(new appError("Please pass the details.", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new appError("Invalid ObjectId format.", 400));
    }
    await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: true,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req?.params?.id) {
      return next(new appError("Please pass the details.", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new appError("Invalid ObjectId format.", 400));
    }

    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({
      status: true,
      data: doc,
    });
  });
exports.findOneAndUpdate = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req?.params?.id) {
      return next(new appError("please pass details", 400));
    }

    const doc = await Model.findById(req.params.id); // Load the document first

    if (!doc) {
      return next(new appError("Document not found", 404));
    }

    // Update the fields from request body
    Object.keys(req.body).forEach((key) => {
      doc[key] = req.body[key];
    });

    await doc.save(); // Save the document to trigger pre('save') middleware

    res.status(200).json({
      status: true,
      data: doc,
    });
  });

exports.executeQuery = () =>
  catchAsync(async (req, res, next) => {
    if (!req.query) {
      return next(new appError("No query found to execute", 400));
    }

    const result = await req.query;

    if (!result) {
      return next(new appError("No document found", 404));
    }

    res.status(200).json({
      status: true,
      data: result,
    });
  });

exports.getAllWithAggregation = (Model, aggregationPipeline = []) =>
  catchAsync(async (req, res, next) => {
    Object.keys(req.query).forEach((key) => {
      if (!req.query[key]) {
        delete req.query[key];
      }
    });
    const query = { ...req.query };
    const excludeFields = [
      "page",
      "limit",
      "sort",
      "fields",
      "populate",
      "groupFields",
      "groupBy",
      "dateField",
      "selectPopulateField",
    ];
    excludeFields.forEach((field) => delete query[field]);

    // Convert query string to MongoDB operators
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|ne|in|nin)\b/g,
      (match) => `$${match}`
    );

    // Parse the query string and handle arrays and dates
    let parsedQuery = JSON.parse(queryStr);

    // Helper function to check if a string is a valid date
    const isValidDate = (dateStr) => {
      const date = new Date(dateStr);
      return date instanceof Date && !isNaN(date);
    };

    // Process special operators and date fields
    Object.keys(parsedQuery).forEach((key) => {
      const value = parsedQuery[key];

      // Check if the field name contains 'date' or 'time' (case insensitive)
      const isDateField = /date|time|created|updated|lastActivityDate/i.test(
        key
      );

      if (typeof value === "object" && value !== null) {
        // Handle operators
        Object.keys(value).forEach((operator) => {
          if (operator === "$in" || operator === "$nin") {
            // Handle arrays
            if (typeof value[operator] === "string") {
              parsedQuery[key][operator] = value[operator].split(",");
            }
          } else if (isDateField && isValidDate(value[operator])) {
            // Convert date strings to Date objects for date fields
            parsedQuery[key][operator] = new Date(value[operator]);
          }
        });
      } else if (isDateField && isValidDate(value)) {
        // Convert simple date strings to Date objects
        parsedQuery[key] = new Date(value);
      }
    });

    const matchStage = parsedQuery;

    // Rest of the code remains the same
    const sortStage = {};
    if (req.query.sort) {
      req.query.sort.split(",").forEach((field) => {
        sortStage[field.replace("-", "")] = field.startsWith("-") ? -1 : 1;
      });
    }

    const projectionStage = {};
    if (req.query.fields) {
      req.query.fields.split(",").forEach((field) => {
        projectionStage[field] = 1;
      });
    }

    const lookupStage = [];
    if (req.query?.populate) {
      if (req?.lookupStage) {
        lookupStage.unshift(...req.lookupStage); // Add lookup stages dynamically
      }
    }

    const groupStage = {};
    const groupFields = req.query.groupFields
      ? req.query.groupFields.split(",")
      : [];
    const groupByTimeFormat = req.query.groupBy || null;
    const dateField = req.query.dateField || "createdTime";

    if (groupFields.length > 0 || groupByTimeFormat) {
      groupStage._id = {};

      groupFields.forEach(
        (field) =>
          (groupStage._id[
            `${field}`.split(".")[`${field}`.split(".").length - 1]
          ] = `$${field}`)
      );
      if (groupByTimeFormat) {
        switch (groupByTimeFormat.toLowerCase()) {
          case "yearly":
            groupStage._id.year = { $year: `$${dateField}` };
            groupStage._id.month = { $month: `$${dateField}` };
            break;
          case "monthly":
            groupStage._id.month = { $month: `$${dateField}` };
            break;
          case "daily":
            groupStage._id.year = { $year: `$${dateField}` };
            groupStage._id.month = { $month: `$${dateField}` };
            groupStage._id.day = { $dayOfMonth: `$${dateField}` };
            break;
          default:
            return next(
              new appError(
                'Invalid groupBy format. Use "yearly", "monthly", or "daily".',
                400
              )
            );
        }
      }
      groupStage.count = { $sum: 1 };
    }
    let middlewarePipeline = [];

    if (req?.middlewarePipeline?.length > 0) {
      middlewarePipeline = req.middlewarePipeline;
    }

    const skip =
      ((parseInt(req.query.page, 10) || 1) - 1) *
      (parseInt(req.query.limit, 10) || 10);
    const limit = parseInt(req.query.limit, 10) || 10;

    const pipeline = [
      ...middlewarePipeline,
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      ...(Object.keys(sortStage).length ? [{ $sort: sortStage }] : []),
      ...lookupStage,
      ...(Object.keys(groupStage).length ? [{ $group: groupStage }] : []),
      ...(Object.keys(projectionStage).length
        ? [{ $project: projectionStage }]
        : []),
      { $skip: skip },
      { $limit: limit },
      ...aggregationPipeline,
    ];

    console.log(JSON.stringify(pipeline));

    const docs = await Model.aggregate(pipeline);
    // const totalResult = await Model.aggregate([
    //   { $match: matchStage },
    //   { $count: "count" },
    // ]);

    let formattedData = docs;
    if (groupByTimeFormat === "yearly") {
      formattedData = Array(12)
        .fill(0)
        .map((_, idx) => {
          const month = docs.find((d) => d._id.month === idx + 1);
          return month
            ? { month: idx + 1, count: month.count }
            : { month: idx + 1, count: 0 };
        });
    }

    res.status(200).json({
      status: true,
      // totalResult: totalResult.length > 0 ? totalResult[0].count : 0,
      data: formattedData,
    });
  });

exports.getFieldFromModal = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.fields) {
      return next(new appError("please pass field", 400));
    }
    let features = new Apifeature(Model.find(), req.query).filter().fields();

    let doc = await features.query;

    res.status(200).send({
      status: true,
      data: doc,
    });
  });
exports.updateFieldOfModal = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.fieldName || !req.query.fieldValue) {
      return next(new appError("please pass data to update", 400));
    }
    req.body = {
      [req.query.fieldName]: req.query.fieldValue,
    };

    const doc = await Model.findOne(req.query.filter); // Load the document first

    if (!doc) {
      return next(new appError("Document not found", 404));
    }

    // Update the fields from request body
    Object.keys(req.body).forEach((key) => {
      doc[key] = req.body[key];
    });

    await doc.save(); // Save the document to trigger pre('save') middleware

    res.status(200).json({
      status: true,
      data: { [req.query.fieldName]: doc[req.query.fieldName] },
    });
  });
