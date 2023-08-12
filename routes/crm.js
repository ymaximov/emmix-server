const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const crmController = require('../controllers/crm')
const adminController = require("../controllers/admin");

router.post('/add-new-customer', auth, crmController.addNewCustomer)
router.get('/get-all-customers-by-tenant-id/:id',  auth, crmController.getCustomersByTenant)
router.put('/update-customer', auth,  crmController.updateCustomer)

module.exports = router