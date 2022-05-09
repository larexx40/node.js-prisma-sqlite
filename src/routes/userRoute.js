const express = require("express");
const userHandler = require('../handlers/userHandler');
const authHandler = require('../handlers/authHandler')
const userRouter =express.Router();


userRouter.get('/find')
userRouter.post('/signup', userHandler.handleSignIn)
userRouter.post('/signin', userHandler.handleLogin)
userRouter.put('/edit')
userRouter.delete('/deleteall')
userRouter.delete('/delete/:id')

userRouter.get('/home', authHandler.handleAuthToken, (req, res)=>{
    res.status(200).send("Welcome 🙌 ");
})

module.exports = userRouter;