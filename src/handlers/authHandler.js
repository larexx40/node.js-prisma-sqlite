const auth = require('../services/authServices');

const handleAuthToken = async (req, res, next)=>{
    const authHeader = req.body.token || req.header('Authorizations');

    console.log({msg: "my auth token is ", token: authHeader});
    //authServices.jwtAuth(token)
    const response = await auth.verifyToken(authHeader);
    console.log(response);
    res.status(response.status ?? 200).json(response);

    return next()
}

const resetPassword = async (res, req)=>{
    const email = req.body;
    const response = await auth.requestResetPassword(email);
    console.log(response);
    res.status(response.status ?? 200).json(response)
}



module.exports ={
    handleAuthToken,
    resetPassword
}