const userSevices = require('../services/userServices');
const authService = require('../services/authServices');


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

const handleForgetPaswordRequest = async (req, res)=>{
    //check if email exist
    //send password reset link to mail
    //verify link
    //collect new password
    //update database in db
    //send success status
    const email= req.body;
    const response = await authService.requestResetPassword(email)
    return res.status(response.status ?? 200).json({msg: response.msg})

}

const handleResetPassword = async (req, res)=>{
    const token = req.body.token
    const userId = req.params.id
    const password = req.body;
    const response = await authService.resetPassword(userId, token, password);
    return res.status(response.status ?? 200).json({msg: response.msg})
}

const handleLogout = async()=>{

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
    handleForgetPaswordRequest,
    handleResetPassword,
    handleLogout

}