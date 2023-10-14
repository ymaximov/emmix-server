const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const { Tenant, Vendor } = require('../models');
const inventoryController = require('../controllers/inventory')
const vendorController = require("../controllers/vendor");

router.get('/get-vendors/:id', auth, inventoryController.getVendors);
router.get('/get-item-groups/:id',auth, inventoryController.getItemGroups);
router.get('/get-item-properties/:id', auth, inventoryController.getItemProperties);
router.get('/get-warehouses/:id', auth, inventoryController.getWarehouses);
router.get('/get-manufacturers/:id', auth, inventoryController.getManufacturers);
router.post('/add-new-inventory-item', auth, inventoryController.addItem)
router.get('/get-inventory-by-tenant-id/:id', auth,  inventoryController.getInventory)
router.put('/update-inventory-item',  auth, inventoryController.updateInventoryItem)
router.get('/get-stock-data-by-item-id', auth, inventoryController.getStockData)
router.put('/update-inventory-gr', auth, inventoryController.updateInventoryForGoodsReceipt)
router.post('/create-delivery', auth, inventoryController.createDelivery)
router.get('/get-delivery-by-id/:id', auth, inventoryController.getDeliveryById)

module.exports = router