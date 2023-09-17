const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

const createSalesQuotation = async(req, res) => {
    try{
        console.log(req.body, 'Req body')
        const createdSalesOrder = await models.sales_quotations.create(req.body)

        const id = createdSalesOrder.id
        console.log(id, 'SQ ID')

        res.status(200).json({ message: 'Sales quotation created successfully', data: id });

    } catch (error) {
        console.error('Error creating purchase order:', error);
        console.log(error, 'ERROR')
        res.status(500).json({ error: 'Please fill out all required data' });
    }

}

const getSQDataBySqID = async (req, res, next) => {
    const sq_id = req.params.id; // Assuming you have a route parameter for po_id
    console.log(sq_id, 'SQ_ID');

    try {
        // Fetch the specific purchase order based on id and include vendor and warehouse details
        const salesQuotation = await models.sales_quotations.findOne({
            where: {
                id: sq_id,
            },
            include: [
                {
                    model: models.customers,
                    // as: 'vendors', // Alias for the included vendor details
                },
                {
                    model: models.tenants,
                    // as: 'vendors', // Alias for the included vendor details
                },
                {
                    model: models.users,
                    // as: 'users', // Alias for the included user details
                },
                {
                    model: models.sales_quotation_items,
                    include: [
                        {
                            model: models.inventory_items,
                            // as: 'inventories', // Alias for the included inventory item details
                        },
                    ],
                },
            ],
        });

        if (!salesQuotation) {
            return res.status(404).json({ message: 'Sales Quotation not found' });
        }

        res.status(200).send({
            message: 'Sales Quotation, Items, and Details have been fetched successfully',
            salesQuotation,
        });
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Purchase Order, Items, and Details' });
        console.error(error, 'ERROR');
    }
};

module.exports = {
    createSalesQuotation,
    getSQDataBySqID
}