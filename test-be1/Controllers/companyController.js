const multer = require("multer");
const Company = require("../models/Company");
const User = require("../models/User");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  updateOne,
  getOne,
  getAll,
  findOneAndUpdate,
  getFieldFromModal,
  updateFieldOfModal,
} = require("../utils/Modelfactory/factory");
const sharp = require("sharp");
const cloudinary = require("cloudinary");
const { default: mongoose } = require("mongoose");

const multerStorage = multer.memoryStorage();
// destination(for saving files) of multer package
const uploads = multer({
  storage: multerStorage,
});

exports.uploadImages = uploads.single("image");

exports.resizeLogoImage = catchAsync(async (req, res, next) => {
  if (!req?.file) {
    return next();
  }

  // leave image
  req.body.image = `${req?.body?.name}-logo.jpg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .toFile(`public/logo/${req.body.image}`);

  next();
});

exports.createCompany = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    mobile,
    code,
    logo,
    website,
    rating,
    tags,
    industry,
    address,
    socialProfile,
    status,
    ozonetelUsername,
    ozonetelApiKey,
    ozonetelcampaignName,
    departments,
  } = req.body;
  if (!name || !email || !mobile) {
    return next(new appError("please provide entire data", 400));
  }
  // const result = await cloudinary.v2.uploader.upload(`public/logo/${req.body.image}`, {
  //     // folder: 'chordz', // Save files in a folder named
  //     // width: 250,
  //     // height: 250,
  //     // gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
  //     // crop: 'fill',
  // });
  const company = await Company.create({
    name,
    email,
    mobile,
    website,
    rating,
    tags,
    industry,
    address,
    socialProfile,
    status,
    code,
    ozonetelUsername,
    ozonetelApiKey,
    ozonetelcampaignName,
    departments,
    // logo:result.secure_url
  });

  if (!company) {
    return next(new appError("Company not created please try again", 500));
  }

  res.status(201).send({
    status: true,
    msg: "Company created ",
  });
});
exports.editCompany = findOneAndUpdate(Company);
exports.getCompany = getOne(Company);

exports.getAllCompany = getAll(Company);

exports.createContactStage = catchAsync(async (req, res, next) => {
  if (
    !req?.params?.module ||
    (req.params?.module !== "leads" && req.params?.module !== "deals")
  ) {
    return next(
      new appError(
        "please pass module for which contact stage is requested",
        400
      )
    );
  }
  let companyId = req?.user?.ofCompany;
  if (!companyId) {
    if (!req.body.ofCompany) {
      return next(new appError("please pass data of company ", 400));
    }
    companyId = req.body.ofCompany;
  }

  const { name, color } = req.body;
  if (!name || !color) {
    return next(new appError("please pass name and color", 400));
  }

  const company = await Company.findById(companyId);

  if (req.params?.module == "leads") {
    if (company.leadContactStage.find((stage) => stage?.name == name)) {
      return next(new appError("  stage is already in use", 400));
    }
    if (company.leadContactStage.find((stage) => stage?.color == color)) {
      return next(new appError("  color is already in use", 400));
    }
    company.leadContactStage = [
      ...company.leadContactStage,
      { name, color, id: Date.now(), toDeal: false },
    ];
  } else {
    if (company.dealContactStage.find((stage) => stage?.name == name)) {
      return next(new appError("  stage is already in use", 400));
    }
    if (company.dealContactStage.find((stage) => stage?.color == color)) {
      return next(new appError("  color is already in use", 400));
    }
    company.dealContactStage = [
      ...company.dealContactStage,
      { name, color, id: Date.now(), dealWon: false, dealLost: false },
    ];
  }

  await company.save();
  res.status(200).send({
    status: true,
    msg: "Contact created",
  });
});

// exports.deleteContactStage = catchAsync(async(req,res,next)=>{

//     const {name}=req.body;

//     const company = await Company.findById(req.user.ofCompany)

//     company.contactStage = company.contactStage.filter((el)=>el != name)

//     await company.save()
//     res.status(200).send({
//         status : true,
//         msg : "Contact deleted"
//     })
// })

exports.updateContactStage = catchAsync(async (req, res, next) => {
  if (
    !req?.params?.module ||
    (req.params?.module !== "leads" && req.params?.module !== "deals")
  ) {
    return next(
      new appError(
        "please pass module for which contact stage is requested",
        400
      )
    );
  }
  let companyId = req?.user?.ofCompany;
  if (!companyId) {
    if (!req.body.ofCompany) {
      return next(new appError("please pass data of company ", 400));
    }
    companyId = req.body.ofCompany;
  }
  const { name, id, toDeal, dealWon, dealLost } = req.body;
  if (!name || !id) {
    return next(new appError("please send data to update", 400));
  }

  const company = await Company.findById(companyId);

  if (req.params?.module == "leads") {
    if (
      [...company?.leadContactStage?.filter((el) => el.id != id)].find(
        (stage) => stage.name == name
      )
    ) {
      return next(new appError("  stage is already in use", 400));
    }
    company.leadContactStage = company.leadContactStage.map((el) => {
      if (toDeal) {
        // making to deal true one to false
        el = { name: el.name, id: el.id, color: el.color, toDeal: false };
      }
      if (el.id == id) {
        el = {
          name: name ? name : el.name,
          id: el.id,
          color: el.color,
          toDeal: toDeal ? toDeal : el.toDeal,
        };
      }

      return el;
    });
  } else {
    if (
      [...company?.dealContactStage?.filter((el) => el.id != id)].find(
        (stage) => stage.name == name
      )
    ) {
      return next(new appError("  stage is already in use", 400));
    }
    company.dealContactStage = company.dealContactStage.map((el) => {
      if (dealWon) {
        // making to deal true one to false
        el = {
          name: el.name,
          id: el.id,
          color: el.color,
          dealWon: false,
          dealLost: el.dealLost,
        };
      }
      if (dealLost) {
        // making to deal true one to false
        el = {
          name: el.name,
          id: el.id,
          color: el.color,
          dealWon: el.dealWon,
          dealLost: false,
        };
      }

      if (el.id == id) {
        el = {
          name: name ? name : el.name,
          id: el.id,
          color: el.color,
          dealWon: dealWon ? true : el.dealWon,
          dealLost: dealLost ? true : el.dealLost,
        };
      }
      return el;
    });
  }

  await company.save();
  res.status(200).send({
    status: true,
    msg: "Contact Stages Updated",
  });
});

exports.updateContactStagesOrder = catchAsync(async (req, res, next) => {
  if (
    !req?.params?.module ||
    (req.params?.module !== "leads" && req.params?.module !== "deals")
  ) {
    return next(
      new appError(
        "please pass module for which contact stage is requested",
        400
      )
    );
  }
  let companyId = req?.user?.ofCompany;
  if (!companyId) {
    if (!req.body.ofCompany) {
      return next(new appError("please pass data of company ", 400));
    }
    companyId = req.body.ofCompany;
  }

  if (!req?.body?.stages) {
    return next(new appError("please pass stages", 400));
  }
  let stages = req.body.stages;

  if (req.params?.module == "leads") {
    await Company.findByIdAndUpdate(companyId, {
      leadContactStage: stages,
    });
  } else if (req.params?.module == "deals") {
    await Company.findByIdAndUpdate(companyId, {
      dealContactStage: stages,
    });
  }

  res.status(200).send({
    status: true,
    msg: "Contact Stages Updated",
  });
});

exports.getContactStages = catchAsync(async (req, res, next) => {
  if (
    !req?.params?.module ||
    (req.params?.module !== "leads" && req.params?.module !== "deals")
  ) {
    return next(
      new appError(
        "please pass module for which contact stage is requested",
        400
      )
    );
  }

  let companyId = req?.user?.ofCompany;
  if (!companyId) {
    if (!req.params.id) {
      return next(new appError("please pass data of company ", 400));
    }
    companyId = req.params.id;
  }
  const company = await Company.findById(companyId);

  let stages = [];
  if (req.params?.module == "leads") {
    stages = company.leadContactStage;
  } else {
    stages = company.dealContactStage;
  }

  res.status(200).send({
    status: true,
    data: stages,
  });
});

exports.getAllCampaignNames = catchAsync(async (req, res, next) => {
  let companyid;
  if (!req.user.ofCompany) {
    companyid = req.params.id;
  } else {
    companyid = req.user.ofCompany._id;
  }

  const campaignNames = await Company.findById(companyid).select(
    "ozonetelcampaignName"
  );

  res.status(200).send({
    status: true,
    data: campaignNames,
  });
});

exports.updateCampaignNames = catchAsync(async (req, res, next) => {
  let companyid;
  if (!req.user.ofCompany) {
    companyid = req.params.id;
  } else {
    companyid = req.user.ofCompany._id;
  }

  const { campaignNamesArray } = req.body;

  const campaignNames = await Company.findByIdAndUpdate(
    companyid,
    {
      ozonetelcampaignName: campaignNamesArray,
    },
    {
      new: true,
    }
  ).select("ozonetelcampaignName");

  res.status(200).send({
    status: true,
    data: campaignNames,
  });
});

exports.getAllDepartmentMiddleware = catchAsync(async (req, res, next) => {
  req.query = {};
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new appError("Invalid ObjectId format.", 400));
  }
  if (req.params.id) {
    req.query._id = req.params.id;
  } else {
    req.query._id = req.user.ofCompany._id;
  }
  req.query.fields = "departments";

  next();
});
exports.getAllDepartment = getFieldFromModal(Company);

exports.updateDepartmentMiddleware = catchAsync(async (req, res, next) => {
  console.log(req.query, req.body);
  req.query = {};

  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new appError("Invalid ObjectId format.", 400));
  }

  // setting the filters
  if (req.params.id) {
    req.query.filter = { _id: req.params.id };
  } else {
    req.query.filter = { _id: req.user.ofCompany._id };
  }
  console.log(req.query, req.body);

  req.query.fieldName = "departments";

  req.query.fieldValue = req.body.departments;

  next();
});

exports.updateDepartment = updateFieldOfModal(Company);
