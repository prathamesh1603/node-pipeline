const appError = require("../utils/appError");

function giveAccess(functionality, action) {
  return (req, res, next) => {
    const user = req.user;
    /*

        points action

        1. create 
        2. edit 
        3. view 
        4. delete 
 


    module -> functionality 
     dashboard
     contacts
     companies
     leads
     deals
        

        */
    //

    if (
      !user ||
      !user.role ||
      !user.role.control ||
      user.role.control[functionality]?.length == 0
    ) {
      return next(new appError("You are not authorized for this route", 401));
    }

    const userAccess = user.role.control[functionality];
    const readAccess = user.role.readVisibility[functionality];
    if (!userAccess) {
      return next(new appError("This module is not added ", 400));
    }

    let access = true;

    let first = userAccess.includes("all");
    if (first) {
      next();
    }

    if (action == "create") {
      access = userAccess.includes("create");
    } else if (action == "update") {
      access = userAccess.includes("update");
    } else if (action == "read") {
      access = userAccess.includes("read");
      req.user.filterReadData = readAccess;
    } else if (action == "delete") {
      access = userAccess.includes("delete");
    }

    // Check if the user has sufficient access points(weather it includes ) for the required functionality
    if (!access) {
      return next(new appError("You are not authorized for this route", 401));
    }

    // Access granted, proceed to the next middleware
    next();
  };
}

module.exports = giveAccess;
