const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const crmController = require('../controllers/crm')

router.post('/add-new-customer', crmController.addNewCustomer)

module.exports = router