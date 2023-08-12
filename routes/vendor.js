const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const vendorController = require('../controllers/vendor')
const CryptoJS = require("crypto-js");
const models = require("../models");

router.post('/add-new-vendor', auth, vendorController.addNewVendor)
router.get('/get-all-vendors-by-tenant-id/:id', auth,  vendorController.getVendorsByTenant)
router.put('/update-vendor',  auth, vendorController.updateVendor)

module.exports = router