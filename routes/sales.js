const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const salesController = require('../controllers/sales')

router.post('/create-sales-quotation', auth, salesController.createSalesQuotation)
router.get('/get-sq-by-id/:id', auth, salesController.getSQDataBySqID)
router.post('/add-item-to-sq', auth, salesController.addItemToSQ)
router.put('/update-item-sq', auth, salesController.updateSQItem)

module.exports = router