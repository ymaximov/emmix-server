const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const vendorController = require('../controllers/vendor')
const CryptoJS = require("crypto-js");
const models = require("../models");
const crmController = require("../controllers/crm");

router.post('/add-new-vendor', vendorController.addNewVendor)
router.get('/get-all-vendors-by-tenant-id/:id',   vendorController.getVendorsByTenant)

module.exports = router