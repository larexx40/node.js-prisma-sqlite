require ('dotenv').config()
const jwt = require('jsonwebtoken');

const createToken =async (id, email)=> jwt.sign({id, email}, process.env.JWT_SECRET,{
    expiresIn: '2h'
})

const verifyToken = async (token)=>{
    if(!token){
        return {
            auth: false,
            msg: "Token is required for authentication",
            status: 401
        }
    }
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded.auth){
            return {
                auth: decoded.auth, 
                msg: `${decoded.msg} or Expired Token`,
                status: decoded.status
            }
        }else{
        req.user = decoded;
        return decoded
        }
        
    } catch (error) {
        return {
            auth: false, 
            msg: "Invalid Token",
            status: 500
        }
    }

}

const requestResetPassword = async (id, email)=>{
    //check if user exist
    //check if user's token in token db
        //delete if exist
    //create randomtoken
    //hast token
    //save hash to token db
    //send plain token to user email
}

const resetPassword = async(id, token, password)=>{
    //check if user's token exist in db
    //if ! return error
    //check if token is valid
        //compare input with hash
    //if valid then hash new password
    //then save 
    //send successfull mail
    //delete token
}

module.exports = {
    createToken,
    verifyToken
}