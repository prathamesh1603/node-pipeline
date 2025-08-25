const catchAsync = require("../utils/catchAsync");

exports.roleControlDataMiddleware  = catchAsync(async(req,res,next)=>{
 // if user is having company then data will be shown to him/her of his/her company only

 if ( req.user.filterReadData == "everything") {
   return next()
}


 if (req?.user?.ofCompany) {
    req.query.ofCompany=req.user.ofCompany;
    if ( req.user.filterReadData == "team") {
       
    }else if ( req.user.filterReadData == "assigned") {
        req.query.assignedTo=req.user._id;
      
    }
    
   return next()
}else{
    next()
}
})
       
    
 


















