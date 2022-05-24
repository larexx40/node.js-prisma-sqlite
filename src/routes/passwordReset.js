const express = require('express')
const authHandler = require('../handlers/authHandler')
const userHandler = require('../handlers/userHandler');
const passwordResetRoute = express.Router()

passwordResetRoute.post('/') //return user id too

passwordResetRoute.post('/:userId/:token')

module.exports= passwordResetRoute;
