require ('dotenv').config()
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailService = require('./nodemailerService')
const userRepository = require('../repositories/userRepository');
const tokenRepository = require('../repositories/tokenRepository');
const bcrypt = require('bcryptjs');
const Joi = require('joi')

const createToken =async (id, email)=> jwt.sign({id, email}, process.env.JWT_SECRET,{
    expiresIn: '2h'
})

const verifyToken = async (authToken)=>{
    if(!authToken){
        return {
            auth: false,
            msg: "Token is required for authentication",
            status: 401 //unauthorized
        }
    }
    const token = authToken.split(' ')[1]
    //console.log({msg: "new token", token: token});
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET)
        //console.log({msg: 'decode token to', decoded: decoded});
        if(!decoded){
            return {
                auth: false ,
                msg: 'Invalid or Expired Token',
                status: 401 //unauthorized 
            }
        }else{
        return decoded
        }
        
    } catch (error) {
        return {
            auth: false, 
            msg: "Error Invalid Token",
            status: 401 //unauthorized;
        }
    }

}

const requestResetPassword = async (email)=>{
    //validate mail
    const schema = Joi.object().keys({
        mail: Joi.string().email().required()
    })
    const {error, value} = schema.validate({email,})
    if (error) {
        console.log("error", error)
        return {
            msg: "email input not valid",
            error,
            status: 403
        }
    }
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
        await tokenRepository.deleteToken(isTokenExist.id)
    }

    //create randomtoken
    const resetToken = crypto.randomBytes(32).toString('hex')
    //hash token
    const hashToken = await bcrypt.hash(resetToken, 10)
    //save token details to token db
    const newToken = {userId: user.id, token: hashToken} 
    await tokenRepository.createToken(newToken)

    //send link to email
    //const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user.id}`;

    //send plain token to user email
    const link = `click this link to reset your password 
        ${process.env.BASE_URL}/passwordreset/${user.id}/${resetToken}`;
    const subject = 'Reset Password'
    //const text = `use the token below to reset your password ${token}`
    mailService.sendEmail(user.email, subject, link )
    console.log("Password reset sent successfully")

    
    //return link

    return{
        msg: "verification token sent to your email",
        token: resetToken,
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