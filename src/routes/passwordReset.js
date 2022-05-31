const express = require('express')
const authHandler = require('../handlers/authHandler')
const userHandler = require('../handlers/userHandler');
const passwordResetRoute = express.Router()

passwordResetRoute.post('/', userHandler.handleForgetPaswordRequest) //return user id too

passwordResetRoute.post('/:userId/:token', userHandler.handleResetPassword)

module.exports= passwordResetRoute;
