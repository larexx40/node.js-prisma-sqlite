const jwtAuth = require('../services/authServices');

const handleAuthToken = async (req, res, next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log({msg: "my auth token is ", token: token});
    //authServices.jwtAuth(token)
    const response = await jwtAuth.verifyToken(token);
    res.status(response.status ?? 200).json(response);
    
    return next()
}



module.exports ={
    handleAuthToken,
}