require ('dotenv').config()
const jwt = require('jsonwebtoken');

const token =async (id, email)=> jwt.sign({id, email}, process.env.JWT_SECRET,{
    expiresIn: '2h'
})

const verifyToken = async(token)=>{
    if(!token){
        return {
            auth: false,
            msg: "Token is required for authentication",
            status: 401
        }
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (error) {
        return {
            auth: false, 
            msg: "Invalid Token",
            status: 500
        }
    }

}

module.exports = {
    token,
    verifyToken
}