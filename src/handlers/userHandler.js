const userSevices = require('../services/userServices');
const jwtAuth = require('../services/jwt');

const handleSignIn = async (req, res)=>{
    const data = req.body
    const response = await userSevices.createUser(data)
    return res.status(response.status ?? 200).json(response)
}

const handleLogin = async (req, res)=>{
    //{email, password}=req.body
    const data = req.body
    const response = await userSevices.login(data)
    return res.status(response.status ?? 200).json({msg: "login successful", response})
}

const handleAuthToken = async (req, res, next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.status(403).send("A token is required for authentication");

    }

    try {
        const decoded = await jwtAuth.verifyToken(token)
        req.user = decoded

    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
    return next
}

/*
handle sign in
check if email exist
=check if account verified via email
=compare store hash and input plain password if password correct
=authorize login
*/

/*
handle forget password
*/

//handle dataValidation
//handle

module.exports = {
    handleSignIn,
    handleLogin,
    handleAuthToken,
}