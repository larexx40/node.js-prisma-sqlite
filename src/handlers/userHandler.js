const userSevices = require('../services/userServices');
const jwtAuth = require('../services/authServices');

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
}