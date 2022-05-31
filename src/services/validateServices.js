const Joi = require('joi');

const validateSignupDetails = async (reqBody)=>{
    let err = [];
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
    const { value, error } = schema.validate({username, email, name, phoneNo, password}, {abortEarly: false});
    if (error) {
        error.details.forEach(element => {
            err.push(element.message)
            console.log(element.message);
        });
        return {
            validated: false,
            err,
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

const validateLoginDetails = async(reqBody)=>{
    let err = []
    const schema = Joi.object({    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    
    }).required()
    
    const {email, password}= reqBody;
    const { value, error } = schema.validate({email, password}, {abortEarly: false});
    
    if (error) {
        error.details.forEach(element => {
            err.push(element.message)
            console.log(element.message);
        });
        return {
            validated: false,
            err,
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

const validatePassword = async (password)=>{
    const schema = Joi.object().keys({
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })
    const {error, value} = schema.validate({password})
    if (error) {
        console.log("error", error)
        return {
            msg: "password input not valid",
            error,
            status: 403
        }
    }else {
        return {
            validated: true,
            value,
            status:200
        }
    }
}

const validateEmail = async(email)=>{
    const schema = Joi.object().keys({
        mail: Joi.string().email().required()
    })
    const {error, value} = schema.validate({email})
    if (error) {
        console.log("error", error)
        return {
            msg: "email input not valid",
            error,
            status: 403
        }
    }else {
        return {
            validated: true,
            value,
            status:200
        }
    }
}
    module.exports  ={
        validateSignupDetails,
        validateLoginDetails,
        validateEmail,
        validatePassword
    }
    