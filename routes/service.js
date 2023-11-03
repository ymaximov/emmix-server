const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const serviceController = require('../controllers/serviceController')
const salesController = require("../controllers/sales");

router.post('/create-equipment-card', auth, serviceController.createEquipmentCard)
router.post('/create-ro-activity', auth, serviceController.createRepairOrderActivity)
router.post('/create-repair-order', auth, serviceController.createRepairOrder)
router.post('/create-service-contract', auth, serviceController.createServiceContract)
router.get('/get-ec-data-by-id/:id', auth, serviceController.getECDataByECID)
router.get('/get-sc-data-by-id/:id', auth, serviceController.getSCDataBySCID)
router.get('/get-ro-data-by-id/:id', auth, serviceController.getRODataByROID)
router.put('/update-ec', auth, serviceController.updateEquipmentCard)
router.put('/update-sc', auth, serviceController.updateServiceContract)
router.put('/update-ro', auth, serviceController.updateRepairOrder)

module.exports = router