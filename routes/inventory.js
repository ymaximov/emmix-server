const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const { Tenant, Vendor } = require('../models');
const inventoryController = require('../controllers/inventory')

router.get('/get-vendors/:id', inventoryController.getVendors)
router.get('/get-item-groups/:id', inventoryController.getItemGroups)
router.get('/get-item-properties/:id', inventoryController.getItemProperties)
router.get('/get-warehouses/:id', inventoryController.getWarehouses)
router.get('/get-manufacturers/:id', inventoryController.getManufacturers)

module.exports = router