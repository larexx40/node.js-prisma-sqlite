require ('dotenv').config()
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const userRepository = require('../repositories/userRepository');
const tokenRepository = require('../repositories/tokenRepository');
const bcrypt = require('bcrypt');

const createToken =async (id, email)=> jwt.sign({id, email}, process.env.JWT_SECRET,{
    expiresIn: '2h'
})

const verifyToken = async (authHeader)=>{
    if(!authHeader){
        return {
            auth: false,
            msg: "Token is required for authentication",
            status: 403 //forbiden
        }
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET)
        console.log({msg: 'decode token to', decoded: decoded});
        if(!decoded.auth){
            return {
                auth: decoded.auth, 
                msg: `${decoded.msg} or Expired Token`,
                status: decoded.status
            }
        }else{
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

const requestResetPassword = async (email)=>{
    //check if user exist
    const user =await userRepository.isUserExist(email);
    if(!user){
        return {
            status: 404, 
            msg: "user does not exist"
        }
    }
    //check if user's token in token db
    const isTokenExist = await tokenRepository.isTokenExist(user.id);
    //delete if exist
    if(isTokenExist){
        await tokenRepository.deleteToken(token.id)
    }

    //create randomtoken
    const resetToken = crypto.randomBytes(32).toString('hex')
    //hash token
    const hashToken = await bcrypt.hash(resetToken, 10)
    //save token details to token db
    const newToken = {userId: user.id, token: hashToken} 
    await tokenRepository.createToken(newToken)

    //send plain token to user email

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user.id}`;
    //return link

    return{
        msg: "verification token sent to your email",
        status: 200
    }
}

const resetPassword = async(id, token, password)=>{
    //check if user's token exist in db
    const isTokenExist = await tokenRepository.isTokenExist(id)
    //if ! return error
    if(!isTokenExist){
        return {
            msg: "invalid or expired token, request reset password",
            status: 403
        }
    }
    //check if token is valid
    const isTokenValid = await bcrypt.compare(token, isTokenExist.token)
    if(!isTokenValid){
        return{
            msg: "invalid or expired token, request reset password",
            status: 403
        }
    }
    //if valid then hash new password
    const newPassword = await bcrypt.hash(password, 10)
    //then save 
    await userRepository.updateUser(id, {password: newPassword})
    //send successfull mail
    //delete token
    await tokenRepository.deleteToken(isTokenExist.id)
}

module.exports = {
    createToken,
    verifyToken,
    requestResetPassword,
    resetPassword
}