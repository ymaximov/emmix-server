const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const salesController = require('../controllers/sales')

router.post('/create-sales-quotation', auth, salesController.createSalesQuotation)
router.get('/get-sq-by-id/:id', auth, salesController.getSQDataBySqID)

module.exports = router