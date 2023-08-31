const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const purchasingController = require('../controllers/purchasing')

router.post('/create-purchase-order', auth, purchasingController.createPO)
router.get('/get-po-by-id/:id', auth, purchasingController.getPODataByPOID)

module.exports = router