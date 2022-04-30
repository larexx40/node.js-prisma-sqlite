require('dotenv').config();
const Joi = require('joi');
const userRepositry = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');


const validateSignupReqBody= async (reqBody)=>{
    if(!reqBody){
        return {
            validated: false,
            error: "request body cannot be empty",
            status: 400
        }
    }

    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(8)
            .max(30)
            .required(),
    
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        phoneNo: Joi.string().alphanum().required(),
        name: Joi.string().required()
    
    }).required()
    
    const {username, email, name, phoneNo, password}= reqBody;
    const { value, error } = schema.validate({username, email, name, phoneNo, password});
    if (error) {
        console.log("error", error)
        return {
            validated: false,
            error,
            status: 400
        }

    }else {
        return {
            validated: true,
            value,
            status:200
        }
    }
}

const validateLoginReqBody = async (reqBody)=>{
    if(!reqBody){
        return {
            validated: false,
            error: "request body cannot be empty",
            status: 400
        }
    }

    const schema = Joi.object({    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    
    }).required()
    
    const {email, password}= reqBody;
    const { value, error } = schema.validate({email, password});
    if (error) {
        console.log("error", error)
        return {
            validated: false,
            error,
            status: 400
        }

    }else {
        return {
            validated: true,
            value,
            status:200
        }
    }
}



const encryptPassword = async(password)=> await bcrypt.hash(password, 10);
const decryptPassword = async(password, hash)=> await bcrypt.compare(password, hash);

const token =async (id, email)=> jwt.sign({id, email}, process.env.JWT_SECRET,{
    expiresIn: '2h'
})
const createUser = async(reqBody)=>{
    //validate request body
    const validateUserRequest =await validateSignupReqBody(reqBody);
    if(!validateUserRequest.validated){
        return validateUserRequest.error
    }
    const data = validateUserRequest.value;
    console.log({msg: 'validated reqbody', data: data});

    //check if user exist
    const userExist = await userRepositry.isUserExist(data.email, data.username, data.phoneNo)
    console.log({msg: "return userExist", data: userExist});

    if(userExist){
        console.log({msg: "user exist"});
        return {
            validated: false,
            error: {msg: "User Exist"},
            status: 400
        }
    }else{
        //encrypt password
        data.password = await encryptPassword(data.password);
        console.log({msg: 'after encryption', data: data});

        //then save to database
        const user = await userRepositry.createUser(data);
        

        //generate token
        user.token = await token(user.id, user.email);
        console.log({msg: "user saved, return user", user: user});

        return {
            validated: true, 
            user, 
            status: 200
        } // include jwt

    }

    }

const login = async(reqBody)=>{
    //validate request body
    //try to pass in only username and password
    const validateLoginRequest =await validateLoginReqBody(reqBody);
    if(!validateLoginRequest.validated){
        return validateLoginRequest.error
    }
    const data = validateLoginRequest.value;
    console.log(data);
 
    //check if user exist
    const user = await userRepositry.isUserExist(data.email)
    console.log({msg: "return userExist", data: user});
    if(!user){
        return {
            validated: false,
            error: {msg: "Email does not exist"},
            status: 404
        }
    }
    //decrypt password
    if(user && await decryptPassword(data.password, user.password)){
        //generate token
        user.token = await token(user.id, user.email);
        console.log(user);
        return {
            validated: true, 
            user, 
            status: 200
        } // include jwt //include jwt
    }



}
//isaccountverified

module.exports = {
    //validateSignupReqBody, 
    //encryptPassword,
    //decryptPassword, 
    createUser,
    login
}