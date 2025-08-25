const mongoose = require("mongoose");
const Timeline = require("./TimeLine");

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  description: { type: String },
  statusHistory: { type: Object },
  mobile: { type: String },
  probability: { type: String, default: "medium" },
  email: {
    type: String,
    required: true,
    // validate: {
    //   validator: async function (email) {
    //     const existingLead = await mongoose.model("Lead").findOne({ email });
    //     return !existingLead; // Ensure email is unique
    //   },
    //   message: "Email already exists!",
    // },
  },

  totalCalls: { type: Number },

  productInterested: {
    type: Object,
  },
  ofCompany: {
    type: mongoose.mongo.ObjectId,
    ref: "Company",
  },
  assignedTo: {
    type: mongoose.mongo.ObjectId,
    ref: "User",
  },
  timeline: {
    type: mongoose.mongo.ObjectId,
    ref: "Timeline",
  },

  /*
  const example = await ExampleModel.findById(someId);
example.set('customFieldName', 'Custom Value');
await example.save();
  */

  // the fields for updation in timeline when updation is being performed

  // field will be comming from F.E
  currentStatus: {
    type: Object,
  },
  lastActivityDate: {
    type: Date,
  },
  // message about operation on lead
  textMessageAboutActivity: {
    type: String,
  },

  createdTime: { type: Date, default: Date.now },
  // identity by whome operation is done
  lastUpdationBy: {
    type: mongoose.mongo.ObjectId,
    ref: "User",
  },

  // added fields
  // franchiseCode : {type : String},
  // refrenceByFranchiseEmail : {type : String},
  // refrenceByFranchiseName : {type : String},
  // relationshipManager : {type : String},
  leadSource: { type: String },
  referenceSource: { type: String },
  leadType: { type: String },
  clientCode: { type: String },
  businessType: { type: String },
  city: { type: String },
  state: { type: String },
  address: { type: Object },
});

// when we are creating bulk lead so timeline creation is handled in middleware

leadSchema.pre("insertMany", async function (next, docs) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const timelineData = docs.map((doc) => doc.timelineDataForMiddleware);
    const timelines = await Timeline.insertMany(timelineData, { session });

    docs.forEach((doc, index) => {
      doc.timeline = timelines[index]._id;
    });

    await session.commitTransaction();
    session.endSession();
    next();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// when updation on lead operation is performed then we add it to timeline
leadSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  /*
  actionStack : {
          type : [{
              actionMsg : String,
              date : Date, 
              to : {
                  type : mongoose.mongo.ObjectId,
                  ref : "User"
              },
              by : {
                  type : mongoose.mongo.ObjectId,
                  ref : "User"
              },
          }]
      }
  */
  const toBeAddedTimelineObject = {
    actionMsg: doc?.textMessageAboutActivity || "updation is done",
    date: doc?.lastActivityDate || new Date().toISOString(),
    by: doc?.lastUpdationBy,
  };

  await Timeline.findByIdAndUpdate(doc.timeline, {
    $push: {
      actionStack: toBeAddedTimelineObject,
    },
  });
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
