const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const serviceController = require('../controllers/serviceController')
const salesController = require("../controllers/sales");

router.post('/create-equipment-card', auth, serviceController.createEquipmentCard)

module.exports = router