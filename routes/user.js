const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const userController = require('../controllers/user')

router.post('/login', userController.loginUser )



module.exports = router
