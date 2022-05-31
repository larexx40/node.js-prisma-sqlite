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

module.exports ={
    handleAuthToken,
}