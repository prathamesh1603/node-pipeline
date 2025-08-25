const mongoose = require("mongoose");
const Timeline = require("./TimeLine");

const dealSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  leadSource: { type: Object },
  description: { type: String },
  statusHistory: { type: Object },
  mobile: { type: String },
  probability: { type: String, default: "medium" },
  email: { type: String, required: true },
  totalCalls: { type: Number },

  createdTime: { type: Date, default: Date.now },
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

  customFields: { type: mongoose.Schema.Types.Mixed },
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
  // identity by whome operation is done
  lastUpdationBy: {
    type: mongoose.mongo.ObjectId,
    ref: "User",
  },
  leadToDealOn: {
    type: Date,
  },
  dealWonOn: {
    type: Date,
  },
  dealLostOn: {
    type: Date,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

dealSchema.pre(/^find/, function (next) {
  this.populate({
    path: "assignedTo lastUpdationBy",
    model: "User",
    select: "name email status",
    // Ensure `User` is referenced correctly
  }); // Populate leadId if required
  next();
});

// when updation on lead operation is performed then we add it to timeline
dealSchema.post("findOneAndUpdate", async function (doc) {
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

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;
