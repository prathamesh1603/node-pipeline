const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const createToken  = (user) =>{
    return  jwt.sign({id:user._id , role:user.role}, secretKey, {expiresIn:'12h'});
}


const  verifyToken = async( token)=>{
      try {
         return jwt.verify(token , secretKey);
      } catch (error) {
        throw new Error('Invalid or Expired token')
      }
}

module.exports = {createToken , verifyToken}