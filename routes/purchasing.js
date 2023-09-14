const express = require('express');
const router = express.Router()
const {auth, isAdmin, isRefreshToken} = require('../middlewares/authentication')
const purchasingController = require('../controllers/purchasing')

router.post('/create-purchase-order', auth, purchasingController.createPO)
router.get('/get-po-by-id/:id', auth, purchasingController.getPODataByPOID)
router.post('/add-item-to-po', auth, purchasingController.addItemToPurchaseOrder)
router.put('/update-line-item', auth, purchasingController.updatePurchaseOrderItem)
router.delete('/delete-line-item', auth, purchasingController.deletePurchaseOrderItem)
router.put('/update-po', auth, purchasingController.updatePurchaseOrder)
router.get('/get-all-po-by-tenant/:id', auth, purchasingController.getPurchaseOrdersByTenant)
router.post('/get-po-data-for-gr', auth, purchasingController.convertPOToGoodsReceipt)
router.put('/receiving/update-rec-quantity/:id', auth, purchasingController.updateReceivedQuanitiy)

module.exports = router