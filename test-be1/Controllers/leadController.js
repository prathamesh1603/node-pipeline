const Lead = require("../models/Lead");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const {
  getOne,
  updateOne,
  deleteOne,
  getAll,
} = require("../utils/Modelfactory/factory");
const Company = require("../models/Company");
const Timeline = require("../models/TimeLine");
const Deal = require("../models/Deal");
const Accounts = require("../models/Account");
const ProductCategory = require("../models/ProductCategory");

// create lead and distribution with adding it to timeline
const createLead = catchAsync(async (req, res, next) => {
  let {
    firstName,
    lastName,
    sources,
    description,
    mobile,
    probability,
    email,
    productInterested,
    mannualForm, // the system genrated form ,
    ofCompany,
    leadSource,
    referenceSource,
    leadType,
    clientCode,
    businessType,
    city,
    state,
    address,
  } = req.body;

  if (!firstName || !lastName) {
    return next(new appError("please enter first name and last name", 400));
  }

  let companyid;
  if (mannualForm) {
    companyid = req?.user?.ofCompany || ofCompany;
    sources = "CRM";
  } else {
    companyid = req.query?.ofCompany;
    productInterested = req?.query?.productInterested;
  }
  if (!companyid) {
    return next(new appError("Please pass company data", 400));
  }

  // get the details of company with callers and last distribution
  const company = await Company.findById(companyid);
  if (company.activeCaller.length == 0) {
    return next(
      new appError("Your Organization do not have any active callers", 500)
    );
  }

  let indexOfCaller = 0;

  if (Boolean(company?.distributeFrom)) {
    indexOfCaller = company.activeCaller.indexOf(company.distributeFrom);
  }

  const alreadyLead = await Lead.findOne({
    email,
    productInterested,
    ofCompany,
  });
  if (alreadyLead) {
    return next(new appError("Lead with this email already exists", 400));
  }

  const lead = await Lead.create({
    firstName,
    lastName,
    sources,
    description,
    mobile,
    probability,
    email,
    productInterested,
    ofCompany: companyid,
    assignedTo: company?.distributeFrom || company.activeCaller[0],
    leadSource,
    referenceSource,
    leadType,
    clientCode,
    businessType,
    city,
    state,
    address,
  });

  if (!lead) {
    return next(new appError("Lead not created please try again", 500));
  }
  // creation of timeline
  const timeline = await Timeline.create({
    leadId: lead._id,
    actionStack: {
      actionMsg: "<b>Lead assigned to caller</b>",
      date: new Date().toGMTString(),
      to: company.distributeFrom || company.activeCaller[0],
      by: req.user._id,
    },
  });

  let nextId = company.activeCaller.at(indexOfCaller + 1);

  if (Boolean(nextId)) {
    company.distributeFrom = company.activeCaller.at(indexOfCaller + 1);
  } else {
    company.distributeFrom = company.activeCaller[0];
  }
  lead.timeline = timeline._id;

  lead.currentStatus = {
    name: "Not Started",
    id: 1,
    color: "#1f1f1f",
  };
  lead.lastActivityDate = new Date().toGMTString();
  lead.textMessageAboutActivity = "Lead is Created and assigned";
  // if it is system genrated then it's id is stored
  lead.lastUpdationBy = req.user._id;

  await lead.save();
  await company.save();

  // creating key iwth company id (._id-lead-count)
  // let data=getRedisData(`${req.user.ofCompany}-lead-count`);
  // if (!data) {
  //   let toInsertData = {
  //     companyId : req.user.ofCompany,
  //     count : 1,
  //     leads : [lead._id]
  //   }
  //   setRedisData(`${req.user.ofCompany}-lead-count`,toInsertData)
  // }else{
  //   // check the count and distribute to callers of that company

  //   if (data.count == 10) {
  //     // distibute lead now

  //   }

  //   let toInsertData = {
  //     companyId : req.user.ofCompany,
  //     count : data?.count + 1,
  //     leads : [...data.leads,lead._id]
  //   }
  //   setRedisData(`${req.user.ofCompany}-lead-count`,toInsertData)
  // }

  res.status(201).json({
    success: true,
    message: "Lead created",
  });
});

const createLeadExternalWebForm = catchAsync(async (req, res, next) => {
  let {
    firstName,
    lastName,
    description,
    mobile,
    email,
    productInterested,
    ofCompany,
    leadSource,
    referenceSource,
    leadType,
    clientCode,
    businessType,
    city,
    state,
  } = req.body;

  // Extract query parameters
  let companyid = req.query?.ofCompany || ofCompany;
  productInterested = req?.query?.productInterested || productInterested;

  // Validation function to handle response format
  const handleError = (message, status) => {
    if (req.query.format === "json") {
      return next(new appError(message, status));
    }
    return res.status(status).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #ffefef;
          }
          .error-container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            text-align: center;
          }
          .error-container h1 {
            color: #e74c3c;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Error</h1>
          <p>${message}</p>
        </div>
      </body>
      </html>
    `);
  };

  // Validation
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length === 0
  ) {
    return handleError(
      "First name is required and must be a valid string",
      400
    );
  }
  if (
    !lastName ||
    typeof lastName !== "string" ||
    lastName.trim().length === 0
  ) {
    return handleError("Last name is required and must be a valid string", 400);
  }
  if (
    !productInterested ||
    typeof productInterested !== "string" ||
    productInterested.trim().length === 0
  ) {
    return handleError(
      "Product interested is required and must be a valid string",
      400
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return handleError("A valid email address is required", 400);
  }

  // Retrieve company details
  const company = await Company.findById(companyid);
  if (!company) {
    return handleError("Invalid company ID", 400);
  }

  if (company.status == "inactive") {
    return handleError("Your organization  is inactive  ", 400);
  }

  const companyProducts = await ProductCategory.find({
    ofCompany: company._id,
  });

  if (companyProducts.length == 0) {
    return handleError("Your organization do not have any product  ", 400);
  }
  let foundProduct = [
    ...companyProducts.reduce((arr, el) => [...arr, ...el?.products], []),
  ].find((el) => el.name == productInterested);

  if (Boolean(!foundProduct)) {
    return handleError(
      "Your organization do not match the product in which you are intrested  ",
      400
    );
  }

  // Check for existing lead
  const alreadyLead = await Lead.findOne({
    email,
    productInterested: foundProduct,
    ofCompany,
  });
  if (alreadyLead) {
    return handleError("Lead with this email already exists", 400);
  }

  let indexOfCaller = 0;
  if (Boolean(company?.distributeFrom)) {
    indexOfCaller = company.activeCaller.indexOf(company.distributeFrom);
  }

  const lead = await Lead.create({
    firstName,
    lastName,
    leadSource,
    description,
    mobile,
    email,
    productInterested: foundProduct,
    ofCompany: companyid,
    assignedTo: company?.distributeFrom || company.activeCaller[0],
    referenceSource,
    leadType,
    clientCode,
    businessType,
    city,
    state,
  });

  if (!lead) {
    return handleError("Lead not created, please try again", 500);
  }

  const timeline = await Timeline.create({
    leadId: lead._id,
    actionStack: {
      actionMsg: "Lead assigned to caller",
      date: new Date().toGMTString(),
      to: company.distributeFrom || company.activeCaller[0],
    },
  });

  let nextId = company.activeCaller.at(indexOfCaller + 1);
  company.distributeFrom = nextId ? nextId : company.activeCaller[0];
  lead.timeline = timeline._id;
  lead.currentStatus = {
    name: "Not Started",
    id: 1,
    color: "#1f1f1f",
  };
  lead.lastActivityDate = new Date().toGMTString();
  lead.textMessageAboutActivity =
    "Lead is Created and assigned through website";

  await lead.save();
  await company.save();

  if (req.query.format === "json") {
    return res.status(201).json({
      status: true,
      msg: "Lead Created",
    });
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f9;
        }
        .thank-you-container {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        .thank-you-container h1 {
          color: #333;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="thank-you-container">
        <h1>Thank you for your submission!</h1>
        <p>Your information has been successfully submitted. We will contact you shortly.</p>
      </div>
    </body>
    </html>
  `);
});

// Get all leads
const getAllLead = getAll(Lead);

const getLead = getOne(Lead);

const updateLeadMiddleware = catchAsync(async (req, res, next) => {
  const { textMessageAboutActivity, currentStatus, description, probability } =
    req.body;

  req.body = {
    textMessageAboutActivity: currentStatus?.toDeal
      ? "<b>Converted To Deal</b>, " + textMessageAboutActivity
      : textMessageAboutActivity,
    convertToDeal: currentStatus?.toDeal || false,
    description,
    probability,
    currentStatus: currentStatus,
    lastActivityDate: new Date().toGMTString(),
    lastUpdationBy: req.user._id,
  };

  next();
});

const convertToDealMiddleware = catchAsync(async (req, res, next) => {
  if (!req.body.convertToDeal) {
    return next();
  }
  // lead to deal

  let lead = await Lead.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
    }
  );
  // remove from lead , create in deal

  if (!lead) {
    return next(new appError("Lead not found please try again", 500));
  }

  let deal = await Deal.create({
    _id: lead._id,
    ...lead._doc,
    currentStatus: {
      name: "Not Started",
      id: 1,
      color: "#1f1f1f",
    },
    leadToDealOn: Date.now(),
  });
  if (!deal) {
    return next(
      new appError("Failed to convert to deal, please try again", 500)
    );
  }
  // update timeline

  // create account

  let account = await Accounts.findOne({
    email: lead.email,
    ofCompany: lead.ofCompany,
  });
  console.log("account", account, account && account?.dealsDetails?.length > 0);

  if (account && account?.dealsDetails?.length > 0) {
    account.dealsDetails = [...account?.dealsDetails, deal._id];
    await account.save();
  } else {
    await Accounts.create({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead?.email,
      ofCompany: lead.ofCompany,
      dealsDetails: deal._id,
    });
  }

  await Lead.findByIdAndDelete(lead._id);

  res.status(200).send({
    status: true,
    msg: "Converted to deal successfully",
    data: deal,
  });

  return;
});

// Update a lead
const updateLead = updateOne(Lead);

// Delete a lead
const deleteLead = deleteOne(Lead);

const serveLeadForm = catchAsync(async (req, res, next) => {
  const { ofCompany } = req.query;

  // Validate the company query parameter
  if (!ofCompany) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head></head>
      <body>
        <h1>Invalid URL</h1>
        <p>Please provide a valid company ID in the URL.</p>
      </body>
      </html>
    `);
  }

  // Check if the company exists
  const company = await Company.findById(ofCompany);
  if (!company) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head></head>
      <body>
        <h1>Organization Not Listed</h1>
        <p>Your organization is not listed in our records.</p>
      </body>
      </html>
    `);
  }

  // Fetch product categories and their products
  const productCategories = await ProductCategory.find({ ofCompany });
  if (!productCategories || productCategories.length === 0) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head></head>
      <body>
        <h1>No Products Found</h1>
        <p>Your organization does not have products available to create leads.</p>
      </body>
      </html>
    `);
  }

  // Build the product category and sub-product dropdown options
  let productOptionsHTML = productCategories
    .map((category) => {
      const subProductsHTML = category.products
        .map(
          (product) =>
            `<option value="${product.name}" data-product='${JSON.stringify(
              product
            )}'>${product.name}</option>`
        )
        .join("");
      return `
      <optgroup label="${category.name}">
        ${subProductsHTML}
      </optgroup>
    `;
    })
    .join("");

  let productPaylod = {};
  if (req.query.productIntrested) {
    productCategories.forEach((category) => {
      const foundProduct = category.products.find(
        (product) => product.name === req.query.productIntrested
      );
      if (foundProduct) {
        productPaylod = foundProduct;
      }
    });

    if (!productPaylod?.name) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head></head>
        <body>
          <h1>Product Not Listed</h1>
          <p>Product with name ${req.query.productIntrested} is not listed in your organization.</p>
        </body>
        </html>
      `);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lead Form</title>
      <style>
        body {
          font-family: 'Roboto', Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to right, #fff, #b8b7b4);
        }
        .container {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          width: 95%;
          max-width: 450px;
          text-align: left;
        }
        .container h1 {
          color: #333;
          margin-bottom: 24px;
          font-size: 26px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        label {
          font-size: 16px;
          font-weight: 500;
          color: #444;
        }
        input, select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
        }
        input:focus, select:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          outline: none;
        }
        input[type="tel"]:invalid {
          border-color: red;
        }
        input[type="tel"]:valid {
          border-color: green;
        }
           input[type="email"]:invalid {
          border-color: red;
        }
        input[type="email"]:valid {
          border-color: green;
        }
        button {
          background: linear-gradient(to right, #000, #000);
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: linear-gradient(to right, #0056b3, #004080);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Lead Form</h1>
        <form id="leadForm" method="POST" action="${
          process.env.BACKEND_URL
        }/api/v1/lead/leadform/form?ofCompany=${ofCompany}">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" required />
  
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" required />
  
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
  
          <label for="mobile">Mobile Number:</label>
          <input type="tel" id="mobile" name="mobile" pattern="^[0-9]{10}$" title="Please enter a valid 10-digit number" required />
  
          ${
            !req?.query?.productIntrested
              ? `
            <label for="productInterested">Product Interested:</label>
            <select id="productInterested" name="productInterested" required>
              ${productOptionsHTML}
            </select>
          `
              : ""
          }
  
          <button type="submit">Submit</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

const distrbuteBulkLead = catchAsync(async (req, res, next) => {
  const { leadIdList, callerId } = req.body;

  if (leadIdList.length == 0 || !callerId) {
    return next(new appError("Please select the leads and caller", 400));
  }

  let filter = { _id: { $in: leadIdList } };
  let update = { assignedTo: callerId };

  let leads = await Lead.find(filter).select("timeline"); // Fetch lead timelines
  if (!leads || leads.length === 0) {
    return next(new appError("No leads found", 404));
  }

  // Update assignedTo for leads
  let confirmation = await Lead.updateMany(filter, update);

  if (confirmation.modifiedCount != leadIdList.length) {
    return next(new appError("Some leads are not distributed", 400));
  }

  // Create a timeline update for each lead
  const actionMsg = "<b>Lead ownership changed to new caller</b>";
  const date = new Date();

  for (let lead of leads) {
    let timelineId = lead.timeline; // Fetch timeline ID
    if (timelineId) {
      await Timeline.findByIdAndUpdate(timelineId, {
        $push: {
          actionStack: {
            actionMsg,
            date,
            to: callerId,
            by: req.user._id, // Assuming `req.user._id` is the ID of the user making the change
          },
        },
      });
    }
  }

  res.status(200).send({
    status: true,
    msg: "Leads distributed and timelines updated successfully",
  });
});

module.exports = {
  createLead,
  getLead,
  getAllLead,
  updateLead,
  deleteLead,
  updateLeadMiddleware,
  convertToDealMiddleware,
  serveLeadForm,
  createLeadExternalWebForm,
  distrbuteBulkLead,
};
