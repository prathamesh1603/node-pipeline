const Timeline = require("../models/TimeLine");

module.exports ={
    USER_CTRL_MSG :{
         USER_NOT_FOUND : 'User not found',
         INVALID_LOGIN_CREDENTIALS: "Invalid login credentials",
         USER_LOGIN_SUCCESSFULL : "User login successfully",
         LOGIN_FAILED : "User Login Failed",
         USER_ALREADY_EXIST : 'User already exist',
         USER_SIGNUP_SUCCESSFULL : "User  signup successfully",
         SIGNUP_FAILED : "User sign up Failed" ,
         All_USERS_FETCHED_SUCCESS : "All users fetched successfully",
         All_USERS_FETCHED_FAILURE : 'error in fetching users'
     },
    LEAD_CTRL_MSG :{
        LEAD_CREAT_SUCCESS : 'Lead Created successfully',
        LEAD_CREAT_FAILURE : 'Lead creation failed',
        LEAD_ALREADY_EXIST : 'Lead already exist',
        LEADS_FETCH_SUCCESS : "Leads retrieved successfully",
        LEADS_FETCH_FAILURE : 'Error retrieving leads',
        LEAD_NOT_FOUND : "Lead not found",
        LEAD_FETCH_SUCCESS : "Lead retrieved successfully",
        LEAD_FETCH_FAILURE : 'Error retrieving lead',
        LEAD_UPDATE_SUCCESS : "Lead updated successfully",
        LEAD_UPDATE_FAILURE: "Lead update failed",
        LEAD_DELETE_SUCCESS :'Lead deleted successfully',
        LEAD_DELETE_FAILURE : 'Lead deletion failed'
    },
    TIMELINE_CTRL_MSG :{
        TIMELINE_ENTRY_SUCCESS : "Timeline entry added successfully",
        TIMELINE_ENTRY_FAILURE  : "Time"
    }
}