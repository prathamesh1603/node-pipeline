const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    actionStack: {
      type: [
        {
          actionMsg: String,
          date: Date,
          to: {
            type: mongoose.mongo.ObjectId,
            ref: "User",
          },
          by: {
            type: mongoose.mongo.ObjectId,
            ref: "User",
          },
        },
      ],
    },
    /*
    object will be of 
    {
    action : "",
    performedBy : ""
    }
    
    */
  },
  {
    timestamps: true,
  }
);

/** Pre-hook for auto-population */
timelineSchema.pre(/^find/, function (next) {
  this.populate({
    path: "actionStack.to actionStack.by",
    model: "User",
    select: "name email status",
    // Ensure `User` is referenced correctly
  }); // Populate leadId if required
  next();
});

const Timeline = mongoose.model("Timeline", timelineSchema);

module.exports = Timeline;
