const multer = require("multer");
const Company = require("../models/Company");
const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const ProductCategory = require("../models/ProductCategory");
const Apifeature = require("../utils/apiFeature");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const ExcelJS = require("exceljs");

const upload = multer({ storage: multer.memoryStorage() });

const flattenObject = (obj, parent = "", res = {}) => {
  // Skip internal Mongoose/MongoDB properties
  const skipProperties = ["$__", "$isNew", "_doc", "__v", "_id"];

  for (const key in obj) {
    if (skipProperties.includes(key)) continue;

    const propName = parent ? `${parent}_${key}` : key;

    // Handle null values
    if (obj[key] === null) {
      res[propName] = "";
      continue;
    }

    // Handle populated fields
    if (obj[key] && typeof obj[key] === "object" && obj[key]._doc) {
      flattenObject(obj[key]._doc, propName, res);
      continue;
    }

    if (Array.isArray(obj[key])) {
      obj[key].forEach((item, index) => {
        const arrayKey = `${propName}_${index}`;
        if (typeof item === "object" && item !== null) {
          flattenObject(item, arrayKey, res);
        } else {
          res[arrayKey] = item?.toString() || "";
        }
      });
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], propName, res);
    } else {
      // Convert ObjectId or primitive values to string
      res[propName] = obj[key]?.toString() || "";
    }
  }
  return res;
};

/**
 * Generates an Excel workbook from report data with memory optimization.
 * @param {Array<Object>} reportData - Array of objects representing the report data.
 * @param {Array<Object>} columns - Array of column definitions.
 * @returns {ExcelJS.Workbook} - The created workbook.
 */
function createExcelWorkbook(reportData, columns) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Set columns with proper headers
  worksheet.columns = columns.map((col) => ({
    ...col,
    header: col.key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  // Add rows in batches to optimize memory
  const BATCH_SIZE = 1000;
  for (let i = 0; i < reportData.length; i += BATCH_SIZE) {
    const batch = reportData.slice(i, i + BATCH_SIZE);
    worksheet.addRows(batch);
  }

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  return workbook;
}

exports.downlodeLeadReport = catchAsync(async (req, res, next) => {
  const { format, createdTime, ofCompany } = req.query;

  if (!createdTime) {
    return next(new appError("Please select date range", 400));
  }
  if (!format) {
    return next(new appError("Please select format", 400));
  }
  if (format !== "excel") {
    return next(new appError("Please pass valid format", 400));
  }

  // Clean up query parameters
  const queryParams = { ...req.query };
  delete queryParams.format;
  queryParams.ofCompany = req?.user?.ofCompany || ofCompany;
  queryParams.populate = "ofCompany,assignedTo";
  queryParams.selectPopulate = "name,email";
  queryParams.fields = "-lastUpdationBy,-timeline";

  // Use lean() to get plain JavaScript objects instead of Mongoose documents
  const features = new Apifeature(Lead.find().lean(), queryParams)
    .populate()
    .filter()
    .sort()
    .fields()
    .pagination();

  const reportData = await features.query;

  if (!reportData.length) {
    return next(new appError("No data available for the selected range", 404));
  }

  try {
    // Process the first record to determine columns
    const flattenedFirstRecord = flattenObject(reportData[0]);
    const columns = Object.keys(flattenedFirstRecord).map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    // Process all records with optimized memory usage
    const flattenedData = reportData.map((record) => flattenObject(record));

    const workbook = createExcelWorkbook(flattenedData, columns);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=lead-report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );

    // Stream the workbook to response
    await workbook.xlsx.write(res);
    res.end();

    // Clean up
    reportData.length = 0;
    flattenedData.length = 0;
  } catch (error) {
    return next(new appError("Error generating report: " + error.message, 500));
  }
});

exports.downlodeDealReport = catchAsync(async (req, res, next) => {
  const { format, createdTime, ofCompany } = req.query;

  if (!createdTime) {
    return next(new appError("Please select date range", 400));
  }
  if (!format) {
    return next(new appError("Please select format", 400));
  }
  if (format !== "excel") {
    return next(new appError("Please pass valid format", 400));
  }

  // Clean up query parameters
  const queryParams = { ...req.query };
  delete queryParams.format;
  queryParams.ofCompany = req?.user?.ofCompany || ofCompany;
  queryParams.populate = "ofCompany,assignedTo";
  queryParams.selectPopulate = "name,email";
  queryParams.fields = "-lastUpdationBy,-timeline";

  // Use lean() to get plain JavaScript objects instead of Mongoose documents
  const features = new Apifeature(Deal.find().lean(), queryParams)
    .populate()
    .filter()
    .sort()
    .fields()
    .pagination();

  const reportData = await features.query;

  if (!reportData.length) {
    return next(new appError("No data available for the selected range", 404));
  }

  try {
    // Process the first record to determine columns
    const flattenedFirstRecord = flattenObject(reportData[0]);
    const columns = Object.keys(flattenedFirstRecord).map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    // Process all records with optimized memory usage
    const flattenedData = reportData.map((record) => flattenObject(record));

    const workbook = createExcelWorkbook(flattenedData, columns);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=lead-report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );

    // Stream the workbook to response
    await workbook.xlsx.write(res);
    res.end();

    // Clean up
    reportData.length = 0;
    flattenedData.length = 0;
  } catch (error) {
    return next(new appError("Error generating report: " + error.message, 500));
  }
});

exports.downlodeProductReport = catchAsync(async (req, res, next) => {
  const { format, createdAt, ofCompany } = req.query;

  if (!createdAt) {
    return next(new appError("Please select date range", 400));
  }
  if (!format) {
    return next(new appError("Please select format", 400));
  }
  if (format !== "excel") {
    return next(new appError("Please pass valid format", 400));
  }

  // Clean up query parameters
  const queryParams = { ...req.query };
  delete queryParams.format;
  queryParams.ofCompany = req?.user?.ofCompany || ofCompany;
  queryParams.populate = "ofCompany updatedBy createdBy";
  queryParams.selectPopulate = "name";

  // Use lean() to get plain JavaScript objects instead of Mongoose documents
  const features = new Apifeature(ProductCategory.find().lean(), queryParams)
    .populate()
    .filter()
    .sort()
    .fields()
    .pagination();

  const reportData = await features.query;
  console.log("report da", reportData);

  if (!reportData.length) {
    return next(new appError("No data available for the selected range", 400));
  }

  try {
    // Process the first record to determine columns
    const flattenedFirstRecord = flattenObject(reportData[0]);
    const columns = Object.keys(flattenedFirstRecord).map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    // Process all records with optimized memory usage
    const flattenedData = reportData.map((record) => flattenObject(record));

    const workbook = createExcelWorkbook(flattenedData, columns);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=lead-report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );

    // Stream the workbook to response
    await workbook.xlsx.write(res);
    res.end();

    // Clean up
    reportData.length = 0;
    flattenedData.length = 0;
  } catch (error) {
    return next(new appError("Error generating report: " + error.message, 500));
  }
});

exports.uploadFileMiddleware = upload.single("file");

// Ensure ExcelJS is installed

exports.importBulkLeads = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new appError("Please upload a file", 400));
  }

  const ofCompany = req.user?.ofCompany || req.body.ofCompany;

  if (!ofCompany) {
    return next(new appError("Pass organization name", 400));
  }

  const company = await Company.findById(ofCompany).select(
    "activeCaller distributeFrom"
  );

  if (!company) {
    return next(new appError("No organization details found", 400));
  }

  const companyProducts = await ProductCategory.find({ ofCompany });

  if (companyProducts.length === 0) {
    return next(
      new appError("Your organization does not have any products", 400)
    );
  }

  const productsList = companyProducts.reduce(
    (arr, el) => [...arr, ...el?.products],
    []
  );

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer); // Load the Excel file from the buffer
  const worksheet = workbook.worksheets[0]; // Get the first sheet

  const data = [];
  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex > 1) {
      // Assuming the first row is the header
      const rowData = {};
      row.eachCell((cell, colIndex) => {
        const header = worksheet.getRow(1).getCell(colIndex).value; // Match cell to header
        rowData[header] = cell.value;
      });
      data.push(rowData);
    }
  });

  let startIndex = company.activeCaller.indexOf(company.distributeFrom);
  if (startIndex === -1) {
    startIndex = 0;
  }

  // Validate and prepare leads
  let leads = [];
  let errorLeads = [];
  // console.log("data", data);

  const productMap = new Map();
  companyProducts.forEach((el) =>
    el.products.forEach((product) =>
      productMap.set(product.name.toLowerCase(), product)
    )
  );
  // Process each lead
  for (const [i, lead] of data.entries()) {
    try {
      // Find the product in the list

      if (productMap.get(lead.productInterested.toLowerCase())) {
        // Create a new lead object with validation
        const leadData = {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead?.email || lead?.email?.text,
          mobile: lead.mobile,
          productInterested: productMap.get(
            lead.productInterested.toLowerCase()
          ),
          ofCompany: ofCompany._id,
          assignedTo: company.activeCaller.at(
            (startIndex + i) % company.activeCaller.length
          ),
          currentStatus: {
            name: "Not Started",
            id: 1,
            color: "#1f1f1f",
          },
          lastActivityDate: new Date().toGMTString(),
          textMessageAboutActivity: "Lead is Created and assigned",
          lastUpdationBy: req.user._id,
          timelineDataForMiddleware: {
            actionStack: {
              actionMsg: "<b>Lead assigned to caller</b>",
              date: new Date().toGMTString(),
              to: company.activeCaller.at(
                (startIndex + i) % company.activeCaller.length
              ),
              by: req.user._id,
            },
          },
        };

        // Validate the lead data using the schema
        const newLead = new Lead(leadData);
        await newLead.validate();

        // Push to leads array for bulk insertion
        leads.push(leadData);
      } else {
        // Push to errorLeads if product not found
        errorLeads.push({ ...lead, error: "product name failed" });
      }
    } catch (error) {
      // Handle validation errors
      errorLeads.push({ ...lead, error: error.message });
    }
  }

  // Insert validated leads in bulk
  if (leads.length > 0) {
    await Lead.insertMany(leads);
  }

  if (errorLeads.length > 0) {
    try {
      // Process the first record to determine columns
      const flattenedFirstRecord = flattenObject(errorLeads[0]);
      const columns = Object.keys(flattenedFirstRecord).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));

      // Process all records with optimized memory usage
      const flattenedData = errorLeads.map((record) => flattenObject(record));

      const workbook = createExcelWorkbook(flattenedData, columns);

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=lead-report-${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      // Stream the workbook to response
      await workbook.xlsx.write(res);
      res.end();

      // Clean up
      errorLeads.length = 0;
      flattenedData.length = 0;
      return;
    } catch (error) {
      return next(
        new appError("Error generating report: " + error.message, 500)
      );
    }
  }

  res.status(201).json({ status: true, msg: "Leads uploaded successfully" });
});
