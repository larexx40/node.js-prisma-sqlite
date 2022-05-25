require('dotenv').config();
const Joi = require('joi');
const userRepositry = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const auth = require('./authServices')
const validateServices = require('./validateServices')


const validateSignupReqBody= async (reqBody)=>{
    if(!reqBody){
        return {
            validated: false,
            error: "request body cannot be empty",
            status: 400
        }
    }
    await validateServices.validateSignupDetails(reqBody)
}

const validateLoginReqBody = async (reqBody)=>{
    if(!reqBody){
        return {
            validated: false,
            error: "request body cannot be empty",
            status: 400
        }
    }
    await validateServices.validateLoginDetails(reqBody)
}

const updateUser = async (reqBody)=>{
    const update = {}
    if(reqBody.password !== null){ 
        update.password = reqBody.password
    }
    if(reqBody.name !== null){
        update.name = reqBody.name
    }
    
    userRepositry.updateUser(id, update)
}


const encryptPassword = async(password)=> await bcrypt.hash(password, 10);
const decryptPassword = async(password, hash)=> await bcrypt.compare(password, hash);

const createUser = async(reqBody)=>{
    //validate request body
    const validateReqBody =await validateSignupReqBody(reqBody);
    if(!validateReqBody.validated){
        return validateReqBody.error
    }
    const data = validateReqBody.value;
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
        user.token = await auth.createToken(user.id, user.email);
        console.log({msg: "user saved, return user", user: user});

        return {
            validated: true, 
            user, //includes token
            status: 200
        }

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
        user.token = await auth.createToken(user.id, user.email);
        console.log(user);
        return {
            validated: true, 
            user, //includes token
            status: 200
        }
    }



}
//isaccountverified

module.exports = {
    //validateSignupReqBody, 
    //encryptPassword,
    //decryptPassword, 
    updateUser,
    createUser,
    login
}