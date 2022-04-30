const express = require("express");
const userHandler = require('../handlers/userHandler');
const userRouter =express.Router();

userRouter.get('/find')
userRouter.post('/signup', userHandler.handleSignIn)
userRouter.post('/signin', userHandler.handleLogin)
userRouter.put('/edit')
userRouter.delete('/deleteall')
userRouter.delete('/delete/:id')

module.exports = userRouter;