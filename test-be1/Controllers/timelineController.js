const Timeline = require("../models/TimeLine");
const { getOne } = require("../utils/Modelfactory/factory");

exports.getTimelineById = getOne(Timeline);
