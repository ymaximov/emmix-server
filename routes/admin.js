const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const userController = require("../controllers/user");
const adminController = require('../controllers/admin')

router.post('/create-tenant',  auth, isAdmin, adminController.createTenant )
router.get('/get-all-tenants',  auth, isAdmin, adminController.getAllTenants)
router.put('/update-tenant-profile/:id', auth, isAdmin, adminController.updateTenant )
router.get('/get-user-accounts-by-tenant-id/:id', auth, isAdmin, adminController.getUserAccountsByTenant)
router.put('/reset-password', auth, isAdmin, adminController.resetPassword)

module.exports = router
