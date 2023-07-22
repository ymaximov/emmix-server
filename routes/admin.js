const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const userController = require("../controllers/user");
const adminController = require('../controllers/admin')

router.post('/create-tenant',  adminController.createTenant )
router.get('/get-all-tenants',   adminController.getAllTenants)
router.put('/update-tenant-profile/:id', adminController.updateTenant )
router.get('/get-user-accounts-by-tenant-id/:id',  adminController.getUserAccountsByTenant)

module.exports = router
