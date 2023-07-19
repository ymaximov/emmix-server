const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const userController = require("../controllers/user");
const adminController = require('../controllers/admin')

router.post('/create-tenant', adminController.createTenant )

module.exports = router
