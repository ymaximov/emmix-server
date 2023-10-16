const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

const createSalesQuotation = async(req, res) => {
    try{
        console.log(req.body, 'Req body')
        const createdSalesQuotation = await models.sales_quotations.create(req.body)

        const id = createdSalesQuotation.id
        console.log(id, 'SQ ID')

        res.status(200).json({ message: 'Sales quotation created successfully', data: id });

    } catch (error) {
        console.error('Error creating purchase order:', error);
        console.log(error, 'ERROR')
        res.status(500).json({ error: 'Please fill out all required data' });
    }

}

const createSalesOrder = async(req, res) => {
    try{
        console.log(req.body, 'Req body')
        const createdSalesOrder = await models.sales_orders.create(req.body)

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
                        {
                            model: models.warehouses,
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

const getSODataBySoID = async (req, res, next) => {
    const so_id = req.params.id; // Assuming you have a route parameter for po_id
    console.log(so_id, 'SO_ID');

    try {
        // Fetch the specific purchase order based on id and include vendor and warehouse details
        const salesOrder = await models.sales_orders.findOne({
            where: {
                id: so_id,
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
                    model: models.so_items,
                    include: [
                        {
                            model: models.inventory_items,
                            // as: 'inventories', // Alias for the included inventory item details
                        },
                        {
                            model: models.warehouses,
                            // as: 'inventories', // Alias for the included inventory item details
                        },
                    ],
                },
            ],
        });

        if (!salesOrder) {
            return res.status(404).json({ message: 'Sales Quotation not found' });
        }

        res.status(200).send({
            message: 'Sales Order, Items, and Details have been fetched successfully',
            salesOrder,
        });
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Purchase Order, Items, and Details' });
        console.error(error, 'ERROR');
    }
};

const addItemToSQ = async (req, res) => {
    try {
        const { tenant_id, user_id, inv_item_id, quantity, unit_price, sq_id, wh_id } = req.body;
        console.log(req.body, 'req body!!');

        // Calculate the total_price
        const total_price = (quantity * unit_price).toFixed(2);

        // Insert the new item into the sales_quotation_items table
        const createdItem = await models.sales_quotation_items.create({
            tenant_id,
            user_id,
            inv_item_id,
            quantity,
            unit_price,
            total_price,
            sq_id,
            wh_id
        });

        // Fetch all items for the corresponding sales quotation (sq_id)
        const items = await models.sales_quotation_items.findAll({
            where: { sq_id },
        });

        // Calculate the new subtotal for the sales quotation
        const newSubtotal = items.reduce((subtotal, item) => subtotal + parseFloat(item.total_price), 0).toFixed(2);

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
            salesTax = ((taxRate / 100) * newSubtotal).toFixed(2); // Divide by 100 to convert percentage to decimal
        }

        // Calculate the new total_amount
        const totalAmount = (parseFloat(newSubtotal) + parseFloat(salesTax)).toFixed(2);

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

const addItemToSalesOrder = async (req, res) => {
    try {
        const salesOrderId = req.body.so_id;
        const newItemData = req.body;
        let inventoryData = null; // Define inventoryData as null by default

        // Calculate the total_price for the new item and round to 2 decimal places
        const newItemTotalPrice = newItemData.unit_price * newItemData.quantity;

        // Format the total price with two decimal places
        const formattedTotalPrice = newItemTotalPrice.toFixed(2);

        // Insert the new item into the sales_order_items table
        const createdItem = await models.so_items.create({
            tenant_id: newItemData.tenant_id,
            so_id: salesOrderId,
            wh_id: newItemData.wh_id,
            inv_item_id: newItemData.inv_item_id,
            quantity: newItemData.quantity,
            unit_price: newItemData.unit_price,
            total_price: formattedTotalPrice, // Formatted to always have two decimal places
        });

        // Fetch all items for the corresponding sales order
        const items = await models.so_items.findAll({
            where: { so_id: salesOrderId },
        });

        // Calculate the new subtotal for the sales order
        const newSubtotal = items.reduce((subtotal, item) => subtotal + parseFloat(item.total_price), 0).toFixed(2);

        // Find the sales order associated with this salesOrderId
        const salesOrder = await models.sales_orders.findByPk(salesOrderId);
        if (!salesOrder) {
            return res.status(404).json({ error: 'Sales order not found' });
        }

        // Update the sales order with the new subtotal
        await salesOrder.update({ subtotal: newSubtotal });

        // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
        const taxRatePercentage = salesOrder.tax_rate; // Example: 10% tax_rate
        const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
        const newSalesTax = (newSubtotal * taxRateDecimal).toFixed(2);

        // Calculate the new total_amount as the sum of newSalesTax and newSubtotal
        const newTotalAmount = (parseFloat(newSalesTax) + parseFloat(newSubtotal)).toFixed(2);

        // Update the sales_orders table with the new sales_tax and total_amount
        await salesOrder.update({
            sales_tax: newSalesTax,
            total_amount: newTotalAmount,
        });

        // Handle inventory updates if it's an inventory item
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                tenant_id: newItemData.tenant_id,
                id: newItemData.inv_item_id,
                inventory_item: true, // Check if it's an inventory item
            },
        });

        if (inventoryItem) {
            inventoryData = await models.inventories.findOne({
                where: {
                    tenant_id: newItemData.tenant_id,
                    item_id: newItemData.inv_item_id,
                    warehouse_id: newItemData.wh_id,
                },
            });

            if (inventoryData) {
                // Calculate the updated available and committed quantities
                const updatedAvailableQuantity = (inventoryData.available || 0) - newItemData.quantity;
                const updatedCommittedQuantity = (inventoryData.committed || 0) + newItemData.quantity;

                // Update inventory data
                await inventoryData.update({
                    available: updatedAvailableQuantity,
                    committed: updatedCommittedQuantity,
                });
            } else {
                // Item doesn't exist in inventories, create a new entry with updated available and committed quantities
                const newAvailableQuantity = -(newItemData.quantity || 0); // Treat null as 0
                const newCommittedQuantity = newItemData.quantity || 0; // Treat null as 0

                inventoryData = await models.inventories.create({
                    tenant_id: newItemData.tenant_id,
                    item_id: newItemData.inv_item_id,
                    warehouse_id: newItemData.wh_id,
                    available: newAvailableQuantity,
                    committed: newCommittedQuantity,
                    in_stock: 0,
                    // Other columns as needed
                });
            }
        }

        // Send the entire response back
        res.status(200).json({
            message: 'Item added to sales order successfully',
            data: {
                item: createdItem,
                salesOrder: salesOrder,
                inventoryData: inventoryData,
            },
        });
    } catch (error) {
        console.error('Error adding item to sales order:', error);
        res.status(500).json({ error: 'Failed to add item to sales order' });
    }
};



// const addItemToSalesOrder = async (req, res) => {
//     try {
//         const salesOrderId = req.body.so_id;
//         const newItemData = req.body;
//         let inventoryData = null; // Define inventoryData as null by default
//
//         // Calculate the total_price for the new item and round to 2 decimal places
//         const newItemTotalPrice = newItemData.unit_price * newItemData.quantity;
//
//         // Format the total price with two decimal places
//         const formattedTotalPrice = newItemTotalPrice.toFixed(2);
//
//         // Insert the new item into the sales_order_items table
//         const createdItem = await models.so_items.create({
//             tenant_id: newItemData.tenant_id,
//             so_id: salesOrderId,
//             wh_id: newItemData.wh_id,
//             inv_item_id: newItemData.inv_item_id,
//             quantity: newItemData.quantity,
//             unit_price: newItemData.unit_price,
//             total_price: formattedTotalPrice, // Formatted to always have two decimal places
//         });
//
//         // Fetch all items for the corresponding sales order
//         const items = await models.so_items.findAll({
//             where: { so_id: salesOrderId },
//         });
//
//         // Calculate the new subtotal for the sales order
//         const newSubtotal = items.reduce((subtotal, item) => subtotal + parseFloat(item.total_price), 0).toFixed(2);
//
//         // Find the sales order associated with this salesOrderId
//         const salesOrder = await models.sales_orders.findByPk(salesOrderId);
//         if (!salesOrder) {
//             return res.status(404).json({ error: 'Sales order not found' });
//         }
//
//         // Update the sales order with the new subtotal
//         await salesOrder.update({ subtotal: newSubtotal });
//
//         // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
//         const taxRatePercentage = salesOrder.tax_rate; // Example: 10% tax_rate
//         const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
//         const newSalesTax = (newSubtotal * taxRateDecimal).toFixed(2);
//
//         // Calculate the new total_amount as the sum of newSalesTax and newSubtotal
//         const newTotalAmount = (parseFloat(newSalesTax) + parseFloat(newSubtotal)).toFixed(2);
//
//         // Update the sales_orders table with the new sales_tax and total_amount
//         await salesOrder.update({
//             sales_tax: newSalesTax,
//             total_amount: newTotalAmount,
//         });
//
//         // Handle inventory updates if it's an inventory item
//         const inventoryItem = await models.inventory_items.findOne({
//             where: {
//                 tenant_id: newItemData.tenant_id,
//                 id: newItemData.inv_item_id,
//                 inventory_item: true, // Check if it's an inventory item
//             },
//         });
//
//         if (inventoryItem) {
//             inventoryData = await models.inventories.findOne({
//                 where: {
//                     tenant_id: newItemData.tenant_id,
//                     item_id: newItemData.inv_item_id,
//                     warehouse_id: newItemData.wh_id,
//                 },
//             });
//
//             // Calculate the updated available and committed quantities without stock availability check
//             const updatedAvailableQuantity = (inventoryData.available || 0) - newItemData.quantity;
//             const updatedCommittedQuantity = (inventoryData.committed || 0) + newItemData.quantity;
//
//             // Update inventory data
//             await inventoryData.update({
//                 available: updatedAvailableQuantity,
//                 committed: updatedCommittedQuantity,
//             });
//         } else {
//             // Item doesn't exist in inventories, create a new entry with updated available and committed quantities
//             const newAvailableQuantity = -newItemData.quantity;
//             const newCommittedQuantity = newItemData.quantity;
//
//             inventoryData = await models.inventories.create({
//                 tenant_id: newItemData.tenant_id,
//                 item_id: newItemData.inv_item_id,
//                 warehouse_id: newItemData.wh_id,
//                 available: newAvailableQuantity,
//                 committed: newCommittedQuantity,
//                 in_stock: 0,
//                 // Other columns as needed
//             });
//         }
//
//         // Send the entire response back
//         res.status(200).json({
//             message: 'Item added to sales order successfully',
//             data: {
//                 item: createdItem,
//                 salesOrder: salesOrder,
//                 inventoryData: inventoryData,
//             },
//         });
//     } catch (error) {
//         console.error('Error adding item to sales order:', error);
//         res.status(500).json({ error: 'Failed to add item to sales order' });
//     }
// };



//
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
        await salesQuotationItem.update({ quantity: newQuantity, unit_price: newUnitPrice, wh_id: req.body.wh_id });

        // Calculate the new total_price based on the updated quantity and unit_price
        const newTotalPrice = (newQuantity * newUnitPrice).toFixed(2); // Ensure two decimal places

        // Update the sales quotation item with the new total_price
        await salesQuotationItem.update({ total_price: newTotalPrice });

        // Find all sales quotation items associated with the same sq_id
        const relatedItems = await models.sales_quotation_items.findAll({
            where: { sq_id: salesQuotationItem.sq_id },
        });
        const newSubtotal = relatedItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0).toFixed(2);

        // Find the sales quotation associated with this sq_id
        const salesQuotation = await models.sales_quotations.findByPk(salesQuotationItem.sq_id);

        // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
        const taxRatePercentage = salesQuotation.tax_rate; // Example: 10% tax_rate
        const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
        const newSalesTax = (newSubtotal * taxRateDecimal).toFixed(2);

        // Calculate the new total_amount as the sum of newSubtotal and newSalesTax
        const newTotalAmount = (parseFloat(newSalesTax) + parseFloat(newSubtotal)).toFixed(2);

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

const updateSOItem = async (req, res) => {
    try {
        const tenant_id = req.body.tenant_id;
        const item_id = req.body.item_id;
        const newQuantity = req.body.quantity;
        const newUnitPrice = req.body.unit_price;
        const wh_id = req.body.wh_id; // Warehouse ID from the front end

        const salesOrderItem = await models.so_items.findOne({
            where: { tenant_id, id: item_id },
        });

        if (!salesOrderItem) {
            console.error('Sales order item not found for the provided tenant_id and item_id.');
            return res.status(404).json({ error: 'Item not found in the sales order' });
        }

        // Find the associated inventory item to update inventories
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                tenant_id,
                id: salesOrderItem.inv_item_id,
            },
        });

        if (inventoryItem) {
            // Get the warehouse ID associated with the sales_order_item
            const currentWarehouseId = salesOrderItem.wh_id;

            // Find the inventory data for the specified warehouse associated with the current sales_order_item
            const currentInventoryData = await models.inventories.findOne({
                where: {
                    tenant_id,
                    item_id: salesOrderItem.inv_item_id,
                    warehouse_id: currentWarehouseId,
                },
            });

            if (currentInventoryData) {
                // Calculate the current quantities in inventory
                const currentAvailableQuantity = currentInventoryData.available || 0;
                const currentCommittedQuantity = currentInventoryData.committed || 0;

                // Subtract the current quantity from the committed and add it to available
                const updatedAvailableQuantity = currentAvailableQuantity + salesOrderItem.quantity;
                const updatedCommittedQuantity = currentCommittedQuantity - salesOrderItem.quantity;

                // Update the inventory data for the current item in the specified warehouse
                await currentInventoryData.update({
                    available: updatedAvailableQuantity,
                    committed: updatedCommittedQuantity,
                });
            }
        }

        // Find or create the inventory data for the specified warehouse from the front end (wh_id)
        let newInventoryData = await models.inventories.findOne({
            where: {
                tenant_id,
                item_id: salesOrderItem.inv_item_id,
                warehouse_id: wh_id, // Warehouse ID from the front end
            },
        });

        if (!newInventoryData) {
            // Create a new entry in inventories if it doesn't exist
            newInventoryData = await models.inventories.create({
                tenant_id,
                item_id: salesOrderItem.inv_item_id,
                warehouse_id: wh_id,
                available: 0,
                committed: 0,
            });
        }

        // Calculate the new quantities in inventory based on the new quantity from the req body
        const newAvailableQuantity = newInventoryData.available || 0;
        const newCommittedQuantity = newInventoryData.committed || 0;

        // Update the inventory data for the new quantity in the specified warehouse from the front end
        await newInventoryData.update({
            available: newAvailableQuantity - newQuantity,
            committed: newCommittedQuantity + newQuantity,
        });

        // Calculate the new total_price based on the updated quantity and unit_price
        const newTotalPrice = (newQuantity * newUnitPrice).toFixed(2);

        // Update the sales order item with the new quantity, unit_price, total_price, and wh_id
        await salesOrderItem.update({
            quantity: newQuantity,
            unit_price: newUnitPrice,
            total_price: newTotalPrice,
            wh_id: wh_id,
        });

        // Update the sales_orders table with the new subtotal, sales_tax, and total_amount
        const relatedItems = await models.so_items.findAll({
            where: { so_id: salesOrderItem.so_id },
        });

        const newSubtotal = relatedItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0).toFixed(2);

        const salesOrder = await models.sales_orders.findByPk(salesOrderItem.so_id);

        const taxRatePercentage = salesOrder.tax_rate;
        const taxRateDecimal = taxRatePercentage / 100;
        const newSalesTax = (newSubtotal * taxRateDecimal).toFixed(2);

        const newTotalAmount = (parseFloat(newSalesTax) + parseFloat(newSubtotal)).toFixed(2);

        await salesOrder.update({
            subtotal: newSubtotal,
            sales_tax: newSalesTax,
            total_amount: newTotalAmount,
        });

        console.log('Updated sales_order_items, inventories, and sales_orders successfully.');
        return res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating tables:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const deleteSQItemAndUpdate = async (req, res) => {
    try {
        const tenant_id = req.query.tenant_id;
        const item_id = req.query.item_id;

        // Find the sales quotation item by tenant_id and ID
        const salesQuotationItem = await models.sales_quotation_items.findOne({
            where: { tenant_id, id: item_id },
        });

        if (!salesQuotationItem) {
            console.error('Sales quotation item not found for the provided tenant_id and ID.');
            return res.status(404).json({ error: 'Item not found' });
        }

        // Find all sales quotation items associated with the same sq_id (excluding the item to be deleted)
        const relatedItems = await models.sales_quotation_items.findAll({
            where: { sq_id: salesQuotationItem.sq_id, id: { [models.Sequelize.Op.ne]: item_id } },
        });

        // Calculate the new subtotal as the sum of total_price for all remaining related items
        const newSubtotal = relatedItems.reduce((sum, item) => sum + item.total_price, 0);

        // Find the sales quotation associated with this sq_id
        const salesQuotation = await models.sales_quotations.findByPk(salesQuotationItem.sq_id);

        // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
        const taxRatePercentage = salesQuotation.tax_rate; // Example: 10% tax_rate
        const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
        const newSalesTax = newSubtotal * taxRateDecimal;

        // Calculate the new total_amount as the sum of newSubtotal and newSalesTax
        const newTotalAmount = newSubtotal + newSalesTax;

        // Delete the sales quotation item from the database
        await salesQuotationItem.destroy();

        // Update the sales_quotations table with the new values
        await salesQuotation.update({
            subtotal: newSubtotal,
            sales_tax: newSalesTax,
            total_amount: newTotalAmount,
        });

        console.log('Deleted sales_quotation_item and updated sales_quotations table successfully.');
        return res.status(200).json({ message: 'Item deleted and sales_quotations updated successfully' });
    } catch (error) {
        console.error('Error deleting item and updating tables:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteSOItemAndUpdate = async (req, res) => {
    try {
        const tenant_id = req.query.tenant_id;
        const item_id = req.query.item_id;

        // Find the sales order item by tenant_id and ID
        const salesOrderItem = await models.so_items.findOne({
            where: { tenant_id, id: item_id },
        });

        if (!salesOrderItem) {
            console.error('Sales order item not found for the provided tenant_id and ID.');
            return res.status(404).json({ error: 'Item not found' });
        }

        // Find the associated inventory item
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                tenant_id,
                id: salesOrderItem.inv_item_id,
            },
        });

        if (inventoryItem) {
            // Find the inventory data for the specified warehouse (wh_id from salesOrderItem)
            const inventoryData = await models.inventories.findOne({
                where: {
                    tenant_id,
                    item_id: salesOrderItem.inv_item_id,
                    warehouse_id: salesOrderItem.wh_id, // Use wh_id from the sales order item
                },
            });

            if (inventoryData) {
                // Update available and committed quantities
                const currentAvailableQuantity = inventoryData.available || 0;
                const currentCommittedQuantity = inventoryData.committed || 0;

                // Subtract the item quantity from "committed" and add it to "available"
                const updatedAvailableQuantity = currentAvailableQuantity + salesOrderItem.quantity;
                const updatedCommittedQuantity = currentCommittedQuantity - salesOrderItem.quantity;

                // Update the inventory data
                await inventoryData.update({
                    available: updatedAvailableQuantity,
                    committed: updatedCommittedQuantity,
                });
            }
        }

        // Delete the sales order item from the database
        await salesOrderItem.destroy();

        // Find all sales order items associated with the same so_id (sales order)
        const relatedItems = await models.so_items.findAll({
            where: { so_id: salesOrderItem.so_id },
        });

        // Calculate the new subtotal based on the related items
        const newSubtotal = relatedItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0).toFixed(2);

        // Find the sales order associated with this so_id
        const salesOrder = await models.sales_orders.findByPk(salesOrderItem.so_id);

        // Calculate the new sales_tax based on the new subtotal and tax_rate (considered as a percentage)
        const taxRatePercentage = salesOrder.tax_rate; // Example: 10% tax_rate
        const taxRateDecimal = taxRatePercentage / 100; // Convert percentage to decimal (0.10)
        const newSalesTax = (newSubtotal * taxRateDecimal).toFixed(2);

        // Calculate the new total_amount as the sum of newSubtotal and newSalesTax
        const newTotalAmount = (parseFloat(newSalesTax) + parseFloat(newSubtotal)).toFixed(2);

        // Update the sales_orders table with the new values
        await salesOrder.update({
            subtotal: newSubtotal,
            sales_tax: newSalesTax,
            total_amount: newTotalAmount,
        });

        console.log('Deleted sales_order_item, updated inventory, and sales_orders successfully.');
        return res.status(200).json({ message: 'Item deleted and sales_orders updated successfully' });
    } catch (error) {
        console.error('Error deleting item and updating tables:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const convertSQToSO = async (req, res) => {
    try {
        const salesQuotationId = req.body.sq_id;
        const tenant_id = req.body.tenant_id;

        // Retrieve sales quotation data
        const salesQuotation = await models.sales_quotations.findByPk(salesQuotationId, {
            include: [{ model: models.sales_quotation_items }],
        });

        if (!salesQuotation) {
            // Sales quotation not found
            return { success: false, message: 'Sales quotation not found' };
        }

        // Create a new sales order based on the sales quotation data
        const salesOrder = await models.sales_orders.create({
            tenant_id,
            user_id: salesQuotation.user_id,
            customer_id: salesQuotation.customer_id,
            due_date: salesQuotation.due_date,
            posting_date: salesQuotation.posting_date,
            sales_tax: salesQuotation.sales_tax,
            subtotal: salesQuotation.subtotal,
            total_amount: salesQuotation.total_amount,
            reference: salesQuotation.reference,
            tax_rate: salesQuotation.tax_rate,
            // Other relevant fields
        });

        // Loop through sales quotation items and create corresponding sales order items
        for (const item of salesQuotation.sales_quotation_items) {
            const { inv_item_id, quantity, unit_price, total_price, wh_id } = item;

            // Check if it's an inventory item
            const inventoryItem = await models.inventory_items.findOne({
                where: {
                    tenant_id,
                    id: inv_item_id,
                    inventory_item: true, // Check the inventory_item column
                },
            });

            // Create a new item in the sales_order_items table
            await models.so_items.create({
                tenant_id,
                so_id: salesOrder.id, // Assign the sales order ID
                inv_item_id,
                quantity,
                unit_price,
                total_price,
                wh_id
                // Include other relevant fields from the sales quotation item
            });

            // Update the inventories table for inventory items
            if (inventoryItem) {
                // Find the inventory item to get the warehouse_id
                // const warehouseId = inventoryItem.default_wh;

                // Update inventories for each item within the specified warehouse
                let inventoryData = await models.inventories.findOne({
                    where: {
                        tenant_id,
                        item_id: inv_item_id,
                        warehouse_id: wh_id,
                    },
                });

                if (inventoryData) {
                    // Update available and committed quantities
                    const currentAvailableQuantity = inventoryData.available || 0;
                    const currentCommittedQuantity = inventoryData.committed || 0;

                    // Calculate the updated available and committed quantities
                    const updatedAvailableQuantity = currentAvailableQuantity - quantity;
                    const updatedCommittedQuantity = currentCommittedQuantity + quantity;

                    await inventoryData.update({
                        available: updatedAvailableQuantity,
                        committed: updatedCommittedQuantity,
                    });
                } else {
                    // If no inventory data exists, create a new entry
                    await models.inventories.create({
                        tenant_id,
                        item_id: inv_item_id,
                        warehouse_id: wh_id,
                        available: -quantity,
                        committed: quantity,
                        // Other columns as needed
                    });
                }
            }
        }

        await salesQuotation.update({
            status: 'closed', // Assuming "closed" is one of the enum values
        });

        res.status(200).json({ message: 'Sales Quotation Converted Successfully', salesOrderId: salesOrder.id });
    } catch (error) {
        console.error('Error converting sales quotation to sales order:', error);
        return { success: false, message: 'Failed to convert sales quotation to sales order' };
    }
};

const voidSO = async (req, res) => {
    try {
        const { tenant_id, so_id } = req.body;

        if (!tenant_id || !so_id) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        // Get all sales order items associated with the provided sales order ID
        const salesOrderItems = await models.so_items.findAll({
            where: {
                so_id,
                tenant_id
            },
        });

        if (!salesOrderItems || salesOrderItems.length === 0) {
            return res.status(404).json({ message: `No sales order items found for Sales Order ID ${so_id}` });
        }

        // Create an array to store promises for async operations
        const asyncOperations = [];

        for (const salesOrderItem of salesOrderItems) {
            const { inv_item_id, quantity, wh_id } = salesOrderItem;

            // Check if the item is marked as an inventory item in the inventory_items table
            const inventoryItem = await models.inventory_items.findOne({
                where: {
                    id: inv_item_id,
                },
            });

            if (!inventoryItem) {
                return res.status(404).json({ message: `Inventory item with ID ${inv_item_id} not found.` });
            }

            if (inventoryItem.inventory_item) {
                // Find the corresponding item in the inventories table
                const inventoryData = await models.inventories.findOne({
                    where: {
                        item_id: inv_item_id,
                        warehouse_id: wh_id, // Use wh_id from the sales order item
                        tenant_id,
                    },
                });

                if (inventoryData) {
                    // Update the inventory by subtracting the quantity from "committed" and adding it to "available"
                    const updatedAvailableQuantity = (inventoryData.available || 0) + quantity;
                    const updatedCommittedQuantity = (inventoryData.committed || 0) - quantity;

                    // Update the inventory data
                    inventoryData.available = updatedAvailableQuantity;
                    inventoryData.committed = updatedCommittedQuantity;

                    // Save the updated inventory item
                    asyncOperations.push(inventoryData.save());
                }
            }
        }

        // Wait for all inventory updates to complete
        await Promise.all(asyncOperations);

        // Update the sales order status to "void"
        const salesOrderToUpdate = await models.sales_orders.findOne({
            where: {
                id: so_id,
                tenant_id,
            },
        });

        if (!salesOrderToUpdate) {
            return res.status(404).json({ message: `Sales Order with ID ${so_id} and Tenant ID ${tenant_id} not found.` });
        }

        // Update the status to "void" (assuming "void" is an enum value)
        salesOrderToUpdate.status = 'void';

        // Save the updated sales order
        await salesOrderToUpdate.save();

        return res.status(200).json({ message: 'Sales Order Has Been Voided' });
    } catch (error) {
        console.error('Error updating inventory and voiding sales order:', error);
        return res.status(500).json({ message: 'Error updating inventory and voiding sales order' });
    }
};


const releaseSO = async (req, res) => {
    try {
        const { tenant_id, so_id } = req.body;

        if (!tenant_id || !so_id) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        // Find the sales order in the database
        const salesOrder = await models.sales_orders.findOne({
            where: {
                id: so_id,
                tenant_id: tenant_id,
                status: 'open', // Check if the status is 'open'
            },
        });

        if (!salesOrder) {
            return res.status(404).json({ message: `Sales order not found or not open for Tenant ID ${tenant_id} and Sales Order ID ${so_id}` });
        }

        // Update the released column to true
        await salesOrder.update({ released: true });

        return res.status(200).json({ message: 'Sales order released successfully' });
    } catch (error) {
        console.error('Error releasing sales order:', error);
        return res.status(500).json({ message: 'Error releasing sales order' });
    }
};

module.exports = releaseSO;




module.exports = {
    createSalesQuotation,
    getSQDataBySqID,
    getSODataBySoID,
    addItemToSQ,
    updateSQItem,
    updateSOItem,
    deleteSQItemAndUpdate,
    createSalesOrder,
    addItemToSalesOrder,
    convertSQToSO,
    deleteSOItemAndUpdate,
    voidSO,
    releaseSO
}