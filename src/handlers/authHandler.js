const auth = require('../services/authServices');

const handleAuthToken = async (req, res, next)=>{
    const authToken = req.headers['authorization'];

    console.log({msg: "my auth token is ", token: authToken});
    //authServices.jwtAuth(token)
    const response = await auth.verifyToken(authToken);
    console.log('our res',response);
    req.user = response;
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