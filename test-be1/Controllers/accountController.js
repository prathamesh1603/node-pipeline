const Accounts = require("../models/Account")
const { getAll, getOne } = require("../utils/Modelfactory/factory")


// Get all account
exports.getAllAccounts =  getAll(Accounts)


exports.getAccount =  getOne(Accounts)













