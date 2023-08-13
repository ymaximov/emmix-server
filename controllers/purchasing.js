const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

const createPO = async (req, res) => {
    try {
        const purchaseOrderData = req.body;

        console.log(req.body, 'REQ BODY')

        // Insert into purchaseorder table
        const createdPurchaseOrder = await models.purchase_orders.create({
            tenant_id: purchaseOrderData.tenant_id,
            vendor_id: purchaseOrderData.vendor_id,
            warehouse_id: purchaseOrderData.warehouse_id,
            // order_date: purchaseOrderData.order_date,
            due_date: purchaseOrderData.due_date,
            // status: purchaseOrderData.status,
            sales_tax: purchaseOrderData.sales_tax,
            subtotal: purchaseOrderData.subtotal,
            total_amount: purchaseOrderData.total_amount
        });

        const poId = createdPurchaseOrder.id; // Assuming your model has an 'id' field


        // Insert each item into purchaseorderitem table
        for (const item of purchaseOrderData.items) {
            const totalPrice = item.price * item.quantity;
            await models.purchase_order_items.create({
                tenant_id: purchaseOrderData.tenant_id,
                po_id: poId,
                inv_item_id: item.inv_item_id,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: totalPrice
            });
        }

        // Calculate total_amount and total_price
        const items = await models.purchase_order_items.findAll({
            where: { po_id: poId },
        });



        // // Update the purchase order with total_amount and total_price
        // await createdPurchaseOrder.update({
        //     total_price: totalPrice,
        // });

        res.status(200).json({ message: 'Purchase order created successfully' });
    } catch (error) {
        console.error('Error creating purchase order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createPO
}