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

const addItemToSQ = async (req, res) => {
    try {
        const { tenant_id, user_id, inv_item_id, quantity, unit_price, sq_id } = req.body;
        console.log(req.body, 'req body!!');

        // Calculate the total_price
        const total_price = quantity * unit_price;

        // Insert the new item into the sales_quotation_items table
        const createdItem = await models.sales_quotation_items.create({
            tenant_id,
            user_id,
            inv_item_id,
            quantity,
            unit_price,
            total_price,
            sq_id,
        });

        // Fetch all items for the corresponding sales quotation (sq_id)
        const items = await models.sales_quotation_items.findAll({
            where: { sq_id },
        });

        // Calculate the new subtotal for the sales quotation
        const newSubtotal = items.reduce((subtotal, item) => subtotal + item.total_price, 0);

        // Fetch the sales_quotations record
        const salesQuotation = await models.sales_quotations.findByPk(sq_id);

        if (!salesQuotation) {
            return res.status(404).json({ error: 'Sales quotation not found' });
        }

        // Use the existing tax_rate from the sales_quotations table
        const taxRate = salesQuotation.tax_rate;

        // Calculate the new sales_tax based on tax_rate and newSubtotal
        let salesTax = 0;
        if (taxRate !== null && taxRate !== 0) {
            salesTax = (taxRate / 100) * newSubtotal; // Divide by 100 to convert percentage to decimal
        }

        // Calculate the new total_amount
        const totalAmount = newSubtotal + salesTax;

        // Update the sales_quotations record with the new subtotal, calculated sales_tax, and total_amount
        await salesQuotation.update({
            subtotal: newSubtotal,
            sales_tax: salesTax,
            total_amount: totalAmount,
        });

        return res.status(200).json({ message: 'Item added to sales quotation successfully', data: createdItem });
    } catch (error) {
        console.error('Error adding item to sales quotation:', error);
        res.status(500).json({ error: 'Failed to add item to sales quotation' });
    }
};






// const addItemToSQ = async (req, res) => {
//     try {
//         const { tenant_id, user_id, inv_item_id, quantity, unit_price, sq_id, tax_rate } = req.body;
//
//         // Calculate the total_price
//         const total_price = quantity * unit_price;
//
//         // Insert the new item into the sales_quotation_items table
//         const createdItem = await models.sales_quotation_items.create({
//             tenant_id,
//             user_id,
//             inv_item_id,
//             quantity,
//             unit_price,
//             total_price,
//             sq_id,
//             tax_rate
//         });
//
//         // Fetch all items for the corresponding sales quotation (sq_id)
//         const items = await models.sales_quotation_items.findAll({
//             where: { sq_id },
//         });
//
//         // Calculate the new subtotal for the sales quotation
//         const newSubtotal = items.reduce((subtotal, item) => subtotal + item.total_price, 0);
//
//         // Fetch the sales_quotations record
//         const salesQuotation = await models.sales_quotations.findByPk(sq_id);
//
//         if (!salesQuotation) {
//             return res.status(404).json({ error: 'Sales quotation not found' });
//         }
//
//         // Update the sales_quotations record with the new subtotal and total_amount
//         const salesTax = salesQuotation.sales_tax;
//
//         if (salesTax === 0 || salesTax === null) {
//             // If sales_tax is 0 or null, set total_amount to be the same as subtotal
//             await salesQuotation.update({
//                 subtotal: newSubtotal,
//                 total_amount: newSubtotal,
//             });
//         } else {
//             // Otherwise, calculate total_amount based on sales_tax
//             await salesQuotation.update({
//                 subtotal: newSubtotal,
//                 total_amount: newSubtotal * salesTax,
//             });
//         }
//
//         return res.status(200).json({ message: 'Item added to sales quotation successfully', data: createdItem });
//     } catch (error) {
//         console.error('Error adding item to sales quotation:', error);
//         res.status(500).json({ error: 'Failed to add item to sales quotation' });
//     }
// };

const updateSQItem = async (req, res) => {
    try {
        const tenant_id = req.body.tenant_id;
        const item_id = req.body.item_id;
        const newQuantity = req.body.quantity;
        const newUnitPrice = req.body.unit_price;

        // Find the sales quotation item by tenant_id and ID
        const salesQuotationItem = await models.sales_quotation_items.findOne({
            where: { tenant_id, id: item_id },
        });

        if (!salesQuotationItem) {
            console.error('Sales quotation item not found for the provided tenant_id and ID.');
            return res.status(404).json({ error: 'Item not found' });
        }

        // Update the sales quotation item with the new quantity and unit_price
        await salesQuotationItem.update({ quantity: newQuantity, unit_price: newUnitPrice });

        // Calculate the new total_price based on the updated quantity and unit_price
        const newTotalPrice = newQuantity * newUnitPrice;

        // Update the sales quotation item with the new total_price
        await salesQuotationItem.update({ total_price: newTotalPrice });

        // Find all sales quotation items associated with the same sq_id
        const relatedItems = await models.sales_quotation_items.findAll({
            where: { sq_id: salesQuotationItem.sq_id },
        });
        const newSubtotal = relatedItems.reduce((sum, item) => sum + item.total_price, 0);

        // Find the sales quotation associated with this sq_id
        const salesQuotation = await models.sales_quotations.findByPk(salesQuotationItem.sq_id);

        // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
        const taxRatePercentage = salesQuotation.tax_rate; // Example: 10% tax_rate
        const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
        const newSalesTax = newSubtotal * taxRateDecimal;

        // Calculate the new total_amount as the sum of newSubtotal and newSalesTax
        const newTotalAmount = newSubtotal + newSalesTax;

        // Update the sales_quotations table with the new values
        await salesQuotation.update({
            subtotal: newSubtotal,
            sales_tax: newSalesTax,
            total_amount: newTotalAmount,
        });

        console.log('Updated sales_quotation_items and sales_quotations tables successfully.');
        return res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating tables:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    createSalesQuotation,
    getSQDataBySqID,
    addItemToSQ,
    updateSQItem
}