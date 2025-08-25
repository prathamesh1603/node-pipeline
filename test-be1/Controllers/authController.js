const User = require("../models/User");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');



const createTokenSendRes = (id, res, statusCode, data) => {

    let token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRIR_IN
    });
  
    let cookieOptions = {
        expires: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
        ),
  
  
        // secure: true,
        httpOnly: true,
        // sameSite: "None",
        path: "/",
    };
    if (process.env.NODE_ENV == 'production') {
  
        cookieOptions.secure = true
    }
    res.cookie('jwt', token, cookieOptions);
  
    // we will set cookies 
    res.status(statusCode).json({ 
        status: true,
        data,
        token
  
    })
  }
  
  
  
exports.login = catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;
  
  
  
    if (!email || !password) {
        return next(new appError("please enter credential for get into in ", 400));
    }
    let user;
    if (`${email}`.includes("@")) {
  
          user = await User.findOne({ email })
  .select('+password')
  .populate([{ path: 'role' }, { path: 'ofCompany',select : "name" }]);

    }  
  
  
  
  
    if (!user || !await user.correctPass(password, user.password)) {
  
        return next(new appError("Please Enter Valid email/mobile or Password", 400));
    }
    user.password = undefined
    if (user.status == "inactive") {
        return next(new appError("your status is inactive , please contact your admin",400))
    }
    createTokenSendRes(user.id, res, 200, user)
  })

  exports.verifyUser = catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;
  
  
  
    if (!email || !password) {
        return next(new appError("please enter credential for get into in ", 400));
    }
    let user;
    if (`${email}`.includes("@")) {
  
          user = await User.findOne({ email })
  .select('+password')
  .populate([{ path: 'role' }, { path: 'ofCompany',select : "name" }]);

    }  
  
  
  
  
    if (!user || !await user.correctPass(password, user.password)) {
  
        return next(new appError("Please Enter valid Password", 400));
    }
  
    res.status(200).send({
        status : true,
        msg : "user is verified"
    })
  })



  exports.signUp = catchAsync(async (req, res, next) => {
    
    const { name
        , email,
        password
        , mobile,
        role
         } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !mobile ||
        !role
    ) {
        return next(new appError("Please fill all the fields", 400))
    } 

    const newUser = await User.create({
        name
        , email
        , mobile,
        password,
        role
    });
    if (!newUser) {
        return next(new appError("something went wrrong  ", 500));
    } 
    newUser.password = undefined;
    createTokenSendRes(newUser._id, res, 201, newUser)
});


exports.logout = catchAsync(async (req, res, next) => {

    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    })

    res.status(200).json({ status: true })
})





































