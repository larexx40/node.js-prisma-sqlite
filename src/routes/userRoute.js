const express = require("express");
const userRouter =express.Router();

userRouter.get('/find')
userRouter.post('/signup')
userRouter.get('/login')
userRouter.put('/edit')
userRouter.delete('/deleteall')
userRouter.delete('/delete/:id')