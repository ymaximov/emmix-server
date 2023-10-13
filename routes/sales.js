const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const salesController = require('../controllers/sales')

router.post('/create-sales-quotation', auth, salesController.createSalesQuotation)
router.post('/create-sales-order', auth, salesController.createSalesOrder)
router.post('/convert-sq-to-so', auth, salesController.convertSQToSO)
router.get('/get-sq-by-id/:id', auth, salesController.getSQDataBySqID)
router.get('/get-so-by-id/:id', auth, salesController.getSODataBySoID)
router.post('/add-item-to-sq', auth, salesController.addItemToSQ)
router.post('/add-item-to-so', auth, salesController.addItemToSalesOrder)
router.put('/update-item-sq', auth, salesController.updateSQItem)
router.put('/update-item-so', auth, salesController.updateSOItem)
router.delete('/delete-item-sq', auth, salesController.deleteSQItemAndUpdate)

module.exports = router