const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');
const {auth} = require("../middlewares/authentication");

const secretKey = process.env.CRYPTO_SECRET;

const getVendors = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        let vendors = await models.vendors.findAll({
            where: {
                tenant_id,
            },
        });

        let warehouses = await models.warehouses.findAll({
            where: {
                tenant_id
            }
        });


        res.status(200).send({message: 'Vendors have been fetched successfully', data: vendors});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Vendors' });
        console.log(error, 'ERROR')
    }
}
const getItemGroups = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {

        let itemGroups = await models.item_groups.findAll({
            where: {
                tenant_id
            }
        });


        res.status(200).send({message: 'Item Groups have been fetched successfully', data: itemGroups});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Item Groups' });
        console.log(error, 'ERROR')
    }
}
const getManufacturers = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        let manufacturers = await models.manufacturers.findAll({
            where: {
                tenant_id
            }
        });


        res.status(200).send({message: 'Manufacturers have been fetched successfully', data: manufacturers});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Manufacturers' });
        console.log(error, 'ERROR')
    }
}

const getItemProperties = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        const itemProperties = await models.item_properties.findAll({
            where: {
                tenant_id
            }
        });


        res.status(200).send({message: 'Item Properties have been fetched successfully', data: itemProperties});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Item Properties' });
        console.log(error, 'ERROR')
    }
}

const getWarehouses = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        let warehouses = await models.warehouses.findAll({
            where: {
                tenant_id
            }
        });


        res.status(200).send({message: 'Warehouses have been fetched successfully', data: warehouses});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Warehouses' });
        console.log(error, 'ERROR')
    }
}

const addItem = async(req, res, next) => {
    console.log('REQ BODY*****', req.body)
    try {
        const newItem = await models.inventory_items.create(req.body)
        res.status(200).send({message: 'Item created successfully', success: true})
    } catch (error) {
        res.status(500).send({message: 'Error creating item', success: false, error});
        console.log('ERROR', error)
    }
}

const getInventory = async (req, res, next) => {
    const tenant_id = req.params.id;
    try {
        const inventoryItems = await models.inventory_items.findAll({
            where: {
                tenant_id,
            },
        });

        const inventoryItemsWithInventories = [];

        for (const inventoryItem of inventoryItems) {
            const inventoryData = await models.inventories.findAll({
                where: {
                    item_id: inventoryItem.id,
                    tenant_id
                },
            });

            // If you want to include all inventory records, assign them to a property in an array.
            inventoryItem.dataValues.inventories = inventoryData;

            inventoryItemsWithInventories.push(inventoryItem);
        }

        res.status(200).send({
            message: 'Inventory Items with associated inventories have been fetched successfully',
            data: inventoryItemsWithInventories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Inventory Items' });
    }
};




// const getInventory = async(req, res, next) => {
//     const tenant_id = req.params.id;
//     console.log(tenant_id, 'TENANTID')
//     try {
//         const inventoryItems = await models.inventory_items.findAll({
//             where: {
//                 tenant_id,
//             },
//         });
//         console.log(inventoryItems, 'INV ITEMS')
//         res.status(200).send({message: 'Inventory Items have been fetched successfully', data: inventoryItems});
//         console.log('inv data pushed to frontkjnfndksnfj')
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching Inventory Items' });
//         console.log(error)
//     }
// }






const updateInventoryItem = async(req, res, next) => {
    const {id, tenant_id} = req.body
    console.log(id, 'IDDD')
    try {

        console.log('***REQUEST BODY****', req.body);

        const options = {
            where: {
                id
            },
        }
        const item = await models.inventory_items.findOne(options)

        console.log('***TENANT ID', tenant_id)

        const updateItem = await item.update(req.body);
        res.status(200).send({message: 'Item updated successfully', success: true})
        console.log('Item has been updated')

    } catch (error) {
        res.status(500).send({message: 'Error updating item', success: false, error});
        console.log('***ERROR***', error)
    }
}

const getStockData = async (req, res) => {
    const { item_id, tenant_id } = req.query;
    console.log(req.query, 'Req query')

    try {
        // Fetch all stock data for the given item_id
        const inventoryData = await models.inventories.findAll({
            where: {
                tenant_id,
                item_id,
            },
            include: [
                {
                    model: models.warehouses, // Include the warehouses table
                    attributes: ['warehouse_name'], // Specify the columns to include
                },
            ],
        });

        // Return the inventory data as JSON response
        res.status(200).json({
            message: 'Inventory Data Fetched Successfully',
            data: inventoryData,
        });
    } catch (error) {
        console.error('Error fetching inventory data:', error);
        res.status(500).json({ message: 'Error fetching inventory data' });
    }
}



const updateInventoryForGoodsReceipt = async (req, res) => {
    try {
        const { goodsReceiptId, warehouseId, tenant_id } = req.body;
        console.log(req.body, 'REQ BODY!')

        // Find the goods receipt to get the associated po_id
        const goodsReceipt = await models.goods_receipts.findOne({
            where: {
                id: goodsReceiptId,
            },
        });

        if (!goodsReceipt) {
            throw new Error(`Goods receipt with ID ${goodsReceiptId} not found.`);
        }

        // Find all items related to the goodsReceiptId in goods_receipt_items
        const goodsReceiptItems = await models.goods_receipt_items.findAll({
            where: {
                goods_receipt_id: goodsReceiptId,
            },
        });

        if (!goodsReceiptItems || goodsReceiptItems.length === 0) {
            throw new Error(`No goods receipt items found for Goods Receipt ID ${goodsReceiptId}.`);
        }

        // Iterate through the items and update inventory for each one
        for (const goodsReceiptItem of goodsReceiptItems) {
            const { inv_item_id, quantity, received_quantity, tenant_id } = goodsReceiptItem;

            // Find the corresponding item in the inventory_items table
            const inventoryItemInfo = await models.inventory_items.findOne({
                where: {
                    id: inv_item_id,
                },
            });

            // Check if inventory_item is true
            if (inventoryItemInfo && inventoryItemInfo.inventory_item) {
                // Find the corresponding item in the inventories table
                const inventoryItem = await models.inventories.findOne({
                    where: {
                        item_id: inv_item_id,
                        warehouse_id: warehouseId,
                    },
                });

                if (!inventoryItem) {
                    throw new Error(`Inventory item with Item ID ${inv_item_id} and Warehouse ID ${warehouseId} not found.`);
                }

                // Update the ordered, in_stock, and available columns
                inventoryItem.ordered -= quantity;
                inventoryItem.in_stock += received_quantity;
                inventoryItem.available += received_quantity;

                // Save the updated inventory item
                await inventoryItem.save();
            }
        }

        // Update the goods receipt status to "closed" in the goods_receipts table
        goodsReceipt.status = 'closed';

        // Save the updated goods receipt item
        await goodsReceipt.save();

        // Find the corresponding purchase order based on po_id
        const purchaseOrder = await models.purchase_orders.findOne({
            where: {
                id: goodsReceipt.po_id,
            },
        });

        if (!purchaseOrder) {
            throw new Error(`Purchase order with ID ${goodsReceipt.po_id} not found.`);
        }

        // Update the status of the purchase order to "closed" (assuming "closed" is an enum value)
        purchaseOrder.status = 'closed';

        // Save the updated purchase order
        await purchaseOrder.save();

        // Update the received_qty in purchase_order_items based on goods_receipt_items
        for (const goodsReceiptItem of goodsReceiptItems) {
            const { inv_item_id, received_quantity } = goodsReceiptItem;
            const purchaseOrderItem = await models.purchase_order_items.findOne({
                where: {
                    po_id: goodsReceipt.po_id,
                    inv_item_id,
                    tenant_id,
                },
            });

            if (purchaseOrderItem) {
                // Update the received_qty column with the received_quantity
                purchaseOrderItem.received_qty = received_quantity;
                await purchaseOrderItem.save();
            }
        }

        // Return a success message or result if needed
        return res.status(200).json({ message: 'Inventory and purchase order updated successfully' });
    } catch (error) {
        console.error('Error updating inventory and purchase order:', error);
        return res.status(500).json({ message: 'Error updating inventory and purchase order' });
    }
};




// const updateInventoryForGoodsReceipt = async (req, res) => {
//     try {
//         const { goodsReceiptId, warehouseId } = req.body;
//
//         // Find all items related to the goodsReceiptId in goods_receipt_items
//         const goodsReceiptItems = await models.goods_receipt_items.findAll({
//             where: {
//                 goods_receipt_id: goodsReceiptId,
//             },
//         });
//
//         if (!goodsReceiptItems || goodsReceiptItems.length === 0) {
//             throw new Error(`No goods receipt items found for Goods Receipt ID ${goodsReceiptId}.`);
//         }
//
//         // Iterate through the items and update inventory for each one
//         for (const goodsReceiptItem of goodsReceiptItems) {
//             const { inv_item_id, quantity, received_quantity } = goodsReceiptItem;
//
//             // Find the corresponding item in the inventory_items table
//             const inventoryItemInfo = await models.inventory_items.findOne({
//                 where: {
//                     id: inv_item_id,
//                 },
//             });
//
//             // Check if inventory_item is true
//             if (inventoryItemInfo && inventoryItemInfo.inventory_item) {
//                 // Find the corresponding item in the inventories table
//                 const inventoryItem = await models.inventories.findOne({
//                     where: {
//                         item_id: inv_item_id,
//                         warehouse_id: warehouseId,
//                     },
//                 });
//
//                 if (!inventoryItem) {
//                     throw new Error(`Inventory item with Item ID ${inv_item_id} and Warehouse ID ${warehouseId} not found.`);
//                 }
//
//                 // Update the ordered, in_stock, and available columns
//                 inventoryItem.ordered -= quantity;
//                 inventoryItem.in_stock += received_quantity;
//                 inventoryItem.available += received_quantity;
//
//                 // Save the updated inventory item
//                 await inventoryItem.save();
//             }
//         }
//
//         // Update the goods receipt status to "closed" in the goods_receipts table
//         const goodsReceiptToUpdate = await models.goods_receipts.findOne({
//             where: {
//                 id: goodsReceiptId,
//             },
//         });
//
//         if (!goodsReceiptToUpdate) {
//             throw new Error(`Goods receipt with ID ${goodsReceiptId} not found.`);
//         }
//
//         // Update the status to "closed" (assuming "closed" is an enum value)
//         goodsReceiptToUpdate.status = 'closed';
//
//         // Save the updated goods receipt item
//         await goodsReceiptToUpdate.save();
//
//         // Find the corresponding purchase order based on po_id
//         const purchaseOrder = await models.purchase_orders.findOne({
//             where: {
//                 id: goodsReceiptToUpdate.po_id,
//             },
//         });
//
//         if (!purchaseOrder) {
//             throw new Error(`Purchase order with ID ${goodsReceiptToUpdate.po_id} not found.`);
//         }
//
//         // Update the status of the purchase order to "closed" (assuming "closed" is an enum value)
//         purchaseOrder.status = 'closed';
//
//         // Save the updated purchase order
//         await purchaseOrder.save();
//
//         // Return a success message or result if needed
//         return res.status(200).json({ message: 'Inventory and purchase order updated successfully' });
//     } catch (error) {
//         console.error('Error updating inventory and purchase order:', error);
//         return res.status(500).json({ message: 'Error updating inventory and purchase order' });
//     }
// };

//correcttttt
// const createDelivery = async (req, res) => {
//     try {
//         const { tenant_id, so_id, wh_id, picker_id } = req.body;
//
//         if (!tenant_id || !so_id || !wh_id) {
//             return res.status(400).json({ message: 'Invalid or empty request body' });
//         }
//
//         // Fetch the existing deliveries for the given sales order and warehouse
//         const existingDeliveries = await models.deliveries.findAll({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'closed', // Only consider closed deliveries
//             },
//             include: [
//                 {
//                     model: models.delivery_items,
//                 },
//             ],
//         });
//
//         // Calculate delivered quantities for each item from existing deliveries
//         const deliveredQuantities = {};
//         for (const delivery of existingDeliveries) {
//             for (const deliveryItem of delivery.delivery_items) {
//                 deliveredQuantities[deliveryItem.inv_item_id] =
//                     (deliveredQuantities[deliveryItem.inv_item_id] || 0) + deliveryItem.delivered_quantity;
//             }
//         }
//
//         // Create a new delivery based on the sales order
//         const salesOrder = await models.sales_orders.findByPk(so_id);
//
//         if (!salesOrder) {
//             return res.status(404).json({ message: `Sales Order with ID ${so_id} not found.` });
//         }
//
//         // Extract the 'invoiced' status from the sales order
//         const { invoiced } = salesOrder;
//
//         const newDelivery = await models.deliveries.create({
//             tenant_id,
//             so_id,
//             wh_id,
//             customer_id: salesOrder.customer_id,
//             picker_id,
//             status: 'open', // Status set to 'open' for a new delivery
//             invoiced, // Invoiced status from the sales order
//             posting_date: salesOrder.posting_date,
//             comments: salesOrder.comments,
//             tracking: '',
//         });
//
//         // Check if there's an existing open delivery
//         const existingOpenDelivery = await models.deliveries.findOne({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open',
//             },
//             include: [
//                 {
//                     model: models.delivery_items,
//                 },
//             ],
//         });
//
//         if (existingOpenDelivery) {
//             // Update the delivered_quantity of delivery_items to 0
//             for (const deliveryItem of existingOpenDelivery.delivery_items) {
//                 await models.delivery_items.update({ delivered_quantity: 0 }, {
//                     where: { id: deliveryItem.id },
//                 });
//             }
//         }
//
//         // Fetch customer details based on customer_id
//         const customerDetails = await models.customers.findByPk(newDelivery.customer_id);
//
//         const newDeliveryItems = [];
//
//         const salesOrderItems = await models.sales_order_items.findAll({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open', // Ensure status is 'open' for sales order items
//             },
//         });
//
//         for (const salesOrderItem of salesOrderItems) {
//             const { inv_item_id, quantity } = salesOrderItem;
//
//             // Fetch the delivered quantities for this sales order item
//             const deliveredQuantity = await models.delivery_items.sum('delivered_quantity', {
//                 where: {
//                     so_id,
//                     inv_item_id,
//                 },
//             });
//
//             // Calculate the remaining quantity
//             const remainingQuantity = quantity - deliveredQuantity;
//
//             // Fetch inventory item details for the current item
//             const inventoryItemDetails = await models.inventory_items.findByPk(inv_item_id);
//
//             if (!inventoryItemDetails) {
//                 return res.status(404).json({ message: `Inventory Item with ID ${inv_item_id} not found.` });
//             }
//
//             const newDeliveryItem = {
//                 tenant_id,
//                 so_id,
//                 delivery_id: newDelivery.id,
//                 inv_item_id,
//                 so_quantity: quantity,
//                 delivered_quantity: 0,
//                 received_quantity: 0,
//                 remaining_quantity: remainingQuantity,
//             };
//
//             const createdDeliveryItem = await models.delivery_items.create(newDeliveryItem);
//
//             const stockData = await models.inventories.findOne({
//                 where: {
//                     item_id: inv_item_id,
//                     warehouse_id: wh_id, // Use the requested warehouse ID
//                 },
//             });
//
//             newDeliveryItems.push({ ...createdDeliveryItem.dataValues, inventoryItem: inventoryItemDetails, stockData });
//         }
//
//         // Send the data to the front end with a status of 200, including the remaining_quantity
//         return res.status(200).json({
//             delivery: {
//                 ...newDelivery.dataValues,
//                 customerDetails,
//             },
//             deliveryItems: newDeliveryItems,
//         });
//     } catch (error) {
//         console.error('Error creating or retrieving delivery and delivery items:', error);
//         return res.status(500).json({ message: 'Error creating or retrieving delivery and delivery items' });
//     }
// };


const createDelivery = async (req, res) => {
    try {
        const { tenant_id, so_id, wh_id, picker_id } = req.body;

        if (!tenant_id || !so_id || !wh_id) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        // Check if there are open sales order items for the given sales order and warehouse
        const openSalesOrderItems = await models.so_items.findAll({
            where: {
                so_id,
                wh_id,
                status: 'open', // Only consider sales order items with "open" status
            },
        });

        if (openSalesOrderItems.length === 0) {
            return res.status(404).json({ message: 'No open sales order items found for this Sales Order and Warehouse.' });
        }

        // Check if there's an existing open delivery
        const existingOpenDelivery = await models.deliveries.findOne({
            where: {
                so_id,
                wh_id,
                status: 'open',
            },
            include: [
                {
                    model: models.delivery_items,
                },
            ],
        });

        if (existingOpenDelivery) {
            // If an open delivery exists, you can send the existing data to the front end.
            const customerDetails = await models.customers.findByPk(existingOpenDelivery.customer_id);

            const existingDeliveryItems = existingOpenDelivery.delivery_items;

            return res.status(200).json({
                delivery: {
                    ...existingOpenDelivery.dataValues,
                    customerDetails,
                },
                deliveryItems: existingDeliveryItems,
            });
        }

        // If no open delivery exists, proceed to create a new delivery
        const salesOrder = await models.sales_orders.findByPk(so_id);

        if (!salesOrder) {
            return res.status(404).json({ message: `Sales Order with ID ${so_id} not found.` });
        }

        // Extract the 'invoiced' and 'released' status from the sales order
        const { invoiced, released, status } = salesOrder;

        if (status !== 'open' || !released) {
            return res.status(400).json({ message: 'Sales Order is not in an open status or not released.' });
        }

        const newDelivery = await models.deliveries.create({
            tenant_id,
            so_id,
            wh_id,
            customer_id: salesOrder.customer_id,
            picker_id,
            status: 'open', // Status set to 'open' for a new delivery
            invoiced, // Invoiced status from the sales order
            posting_date: salesOrder.posting_date,
            comments: salesOrder.comments,
            tracking: '',
        });

        // Fetch customer details based on customer_id
        const customerDetails = await models.customers.findByPk(newDelivery.customer_id);

        const newDeliveryItems = [];

        for (const salesOrderItem of openSalesOrderItems) {
            const { inv_item_id, quantity } = salesOrderItem;

            // Fetch the delivered quantities for this sales order item
            const deliveredQuantity = await models.delivery_items.sum('delivered_quantity', {
                where: {
                    so_id,
                    inv_item_id,
                },
            });

            // Calculate the remaining quantity
            const remainingQuantity = quantity - deliveredQuantity;

            // Fetch inventory item details for the current item
            const inventoryItemDetails = await models.inventory_items.findByPk(inv_item_id);

            if (!inventoryItemDetails) {
                return res.status(404).json({ message: `Inventory Item with ID ${inv_item_id} not found.` });
            }

            const newDeliveryItem = {
                tenant_id,
                so_id,
                delivery_id: newDelivery.id,
                inv_item_id,
                so_quantity: quantity,
                delivered_quantity: 0,
                received_quantity: 0,
                remaining_quantity: remainingQuantity,
            };

            const createdDeliveryItem = await models.delivery_items.create(newDeliveryItem);

            const stockData = await models.inventories.findOne({
                where: {
                    item_id: inv_item_id,
                    warehouse_id: wh_id, // Use the requested warehouse ID
                },
            });

            newDeliveryItems.push({ ...createdDeliveryItem.dataValues, inventoryItem: inventoryItemDetails, stockData });
        }

        // Send the data to the front end with a status of 200, including the remaining_quantity
        return res.status(200).json({
            delivery: {
                ...newDelivery.dataValues,
                customerDetails,
            },
            deliveryItems: newDeliveryItems,
        });
    } catch (error) {
        console.error('Error creating or retrieving delivery and delivery items:', error);
        return res.status(500).json({ message: 'Error creating or retrieving delivery and delivery items' });
    }
};


// const createDelivery = async (req, res) => {
//     try {
//         const { tenant_id, so_id, wh_id, picker_id } = req.body;
//
//         if (!tenant_id || !so_id || !wh_id) {
//             return res.status(400).json({ message: 'Invalid or empty request body' });
//         }
//
//         // Check if there are open sales order items for the given sales order and warehouse
//         const openSalesOrderItems = await models.so_items.findAll({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open', // Only consider sales order items with "open" status
//             },
//         });
//
//         if (openSalesOrderItems.length === 0) {
//             return res.status(404).json({ message: 'No open sales order items found for this Sales Order and Warehouse.' });
//         }
//
//         // Check if there's an existing open delivery
//         const existingOpenDelivery = await models.deliveries.findOne({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open',
//             },
//             include: [
//                 {
//                     model: models.delivery_items,
//                 },
//             ],
//         });
//
//         if (existingOpenDelivery) {
//             // If an open delivery exists, you can send the existing data to the front end.
//             const customerDetails = await models.customers.findByPk(existingOpenDelivery.customer_id);
//
//             const existingDeliveryItems = existingOpenDelivery.delivery_items;
//
//             return res.status(200).json({
//                 delivery: {
//                     ...existingOpenDelivery.dataValues,
//                     customerDetails,
//                 },
//                 deliveryItems: existingDeliveryItems,
//             });
//         }
//
//         // If no open delivery exists, proceed to create a new delivery
//         const salesOrder = await models.sales_orders.findByPk(so_id);
//
//         if (!salesOrder) {
//             return res.status(404).json({ message: `Sales Order with ID ${so_id} not found.` });
//         }
//
//         // Extract the 'invoiced' status from the sales order
//         const { invoiced } = salesOrder;
//
//         const newDelivery = await models.deliveries.create({
//             tenant_id,
//             so_id,
//             wh_id,
//             customer_id: salesOrder.customer_id,
//             picker_id,
//             status: 'open', // Status set to 'open' for a new delivery
//             invoiced, // Invoiced status from the sales order
//             posting_date: salesOrder.posting_date,
//             comments: salesOrder.comments,
//             tracking: '',
//         });
//
//         // Fetch customer details based on customer_id
//         const customerDetails = await models.customers.findByPk(newDelivery.customer_id);
//
//         const newDeliveryItems = [];
//
//         for (const salesOrderItem of openSalesOrderItems) {
//             const { inv_item_id, quantity } = salesOrderItem;
//
//             // Fetch the delivered quantities for this sales order item
//             const deliveredQuantity = await models.delivery_items.sum('delivered_quantity', {
//                 where: {
//                     so_id,
//                     inv_item_id,
//                 },
//             });
//
//             // Calculate the remaining quantity
//             const remainingQuantity = quantity - deliveredQuantity;
//
//             // Fetch inventory item details for the current item
//             const inventoryItemDetails = await models.inventory_items.findByPk(inv_item_id);
//
//             if (!inventoryItemDetails) {
//                 return res.status(404).json({ message: `Inventory Item with ID ${inv_item_id} not found.` });
//             }
//
//             const newDeliveryItem = {
//                 tenant_id,
//                 so_id,
//                 delivery_id: newDelivery.id,
//                 inv_item_id,
//                 so_quantity: quantity,
//                 delivered_quantity: 0,
//                 received_quantity: 0,
//                 remaining_quantity: remainingQuantity,
//             };
//
//             const createdDeliveryItem = await models.delivery_items.create(newDeliveryItem);
//
//             const stockData = await models.inventories.findOne({
//                 where: {
//                     item_id: inv_item_id,
//                     warehouse_id: wh_id, // Use the requested warehouse ID
//                 },
//             });
//
//             newDeliveryItems.push({ ...createdDeliveryItem.dataValues, inventoryItem: inventoryItemDetails, stockData });
//         }
//
//         // Send the data to the front end with a status of 200, including the remaining_quantity
//         return res.status(200).json({
//             delivery: {
//                 ...newDelivery.dataValues,
//                 customerDetails,
//             },
//             deliveryItems: newDeliveryItems,
//         });
//     } catch (error) {
//         console.error('Error creating or retrieving delivery and delivery items:', error);
//         return res.status(500).json({ message: 'Error creating or retrieving delivery and delivery items' });
//     }
// };



// workign
// const createDelivery = async (req, res) => {
//     try {
//         const { tenant_id, so_id, wh_id, picker_id } = req.body;
//
//         if (!tenant_id || !so_id || !wh_id) {
//             return res.status(400).json({ message: 'Invalid or empty request body' });
//         }
//
//         // Check if there are open sales order items for the given sales order and warehouse
//         const openSalesOrderItems = await models.so_items.findAll({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open', // Only consider sales order items with "open" status
//             },
//         });
//
//         if (openSalesOrderItems.length === 0) {
//             return res.status(404).json({ message: 'No open sales order items found for this Sales Order and Warehouse.' });
//         }
//
//         // Fetch the existing deliveries for the given sales order and warehouse
//         const existingDeliveries = await models.deliveries.findAll({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'closed', // Only consider closed deliveries
//             },
//             include: [
//                 {
//                     model: models.delivery_items,
//                 },
//             ],
//         });
//
//         // Calculate delivered quantities for each item from existing deliveries
//         const deliveredQuantities = {};
//         for (const delivery of existingDeliveries) {
//             for (const deliveryItem of delivery.delivery_items) {
//                 deliveredQuantities[deliveryItem.inv_item_id] =
//                     (deliveredQuantities[deliveryItem.inv_item_id] || 0) + deliveryItem.delivered_quantity;
//             }
//         }
//
//         // Create a new delivery based on the sales order
//         const salesOrder = await models.sales_orders.findByPk(so_id);
//
//         if (!salesOrder) {
//             return res.status(404).json({ message: `Sales Order with ID ${so_id} not found.` });
//         }
//
//         // Extract the 'invoiced' status from the sales order
//         const { invoiced } = salesOrder;
//
//         const newDelivery = await models.deliveries.create({
//             tenant_id,
//             so_id,
//             wh_id,
//             customer_id: salesOrder.customer_id,
//             picker_id,
//             status: 'open', // Status set to 'open' for a new delivery
//             invoiced, // Invoiced status from the sales order
//             posting_date: salesOrder.posting_date,
//             comments: salesOrder.comments,
//             tracking: '',
//         });
//
//         // Check if there's an existing open delivery
//         const existingOpenDelivery = await models.deliveries.findOne({
//             where: {
//                 so_id,
//                 wh_id,
//                 status: 'open',
//             },
//             include: [
//                 {
//                     model: models.delivery_items,
//                 },
//             ],
//         });
//
//         if (existingOpenDelivery) {
//             // Update the delivered_quantity of delivery_items to 0
//             for (const deliveryItem of existingOpenDelivery.delivery_items) {
//                 await models.delivery_items.update({ delivered_quantity: 0 }, {
//                     where: { id: deliveryItem.id },
//                 });
//             }
//         }
//
//         // Fetch customer details based on customer_id
//         const customerDetails = await models.customers.findByPk(newDelivery.customer_id);
//
//         const newDeliveryItems = [];
//
//         for (const salesOrderItem of openSalesOrderItems) {
//             const { inv_item_id, quantity } = salesOrderItem;
//
//             // Fetch the delivered quantities for this sales order item
//             const deliveredQuantity = await models.delivery_items.sum('delivered_quantity', {
//                 where: {
//                     so_id,
//                     inv_item_id,
//                 },
//             });
//
//             // Calculate the remaining quantity
//             const remainingQuantity = quantity - deliveredQuantity;
//
//             // Fetch inventory item details for the current item
//             const inventoryItemDetails = await models.inventory_items.findByPk(inv_item_id);
//
//             if (!inventoryItemDetails) {
//                 return res.status(404).json({ message: `Inventory Item with ID ${inv_item_id} not found.` });
//             }
//
//             const newDeliveryItem = {
//                 tenant_id,
//                 so_id,
//                 delivery_id: newDelivery.id,
//                 inv_item_id,
//                 so_quantity: quantity,
//                 delivered_quantity: 0,
//                 received_quantity: 0,
//                 remaining_quantity: remainingQuantity,
//             };
//
//             const createdDeliveryItem = await models.delivery_items.create(newDeliveryItem);
//
//             const stockData = await models.inventories.findOne({
//                 where: {
//                     item_id: inv_item_id,
//                     warehouse_id: wh_id, // Use the requested warehouse ID
//                 },
//             });
//
//             newDeliveryItems.push({ ...createdDeliveryItem.dataValues, inventoryItem: inventoryItemDetails, stockData });
//         }
//
//         // Send the data to the front end with a status of 200, including the remaining_quantity
//         return res.status(200).json({
//             delivery: {
//                 ...newDelivery.dataValues,
//                 customerDetails,
//             },
//             deliveryItems: newDeliveryItems,
//         });
//     } catch (error) {
//         console.error('Error creating or retrieving delivery and delivery items:', error);
//         return res.status(500).json({ message: 'Error creating or retrieving delivery and delivery items' });
//     }
// };



const getDeliveryById = async (req, res) => {
    console.log(req.params, 'Req Params');
    const deliveryId = req.params.id; // Assuming the delivery ID is passed as a URL parameter

    try {
        // Retrieve delivery details by ID and include associated delivery items
        const delivery = await models.deliveries.findByPk(deliveryId, {
            include: [
                {
                    model: models.delivery_items, // Include associated delivery items
                    attributes: ['id', 'inv_item_id', 'so_quantity', 'remaining_quantity', 'delivered_quantity'], // Include relevant attributes
                },
                {
                    model: models.customers, // Include associated customer details
                    attributes: { exclude: [] }, // Retrieve all columns from customers
                },
            ],
        });

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Loop through delivery items to get inventory and inventory item details for each
        const deliveryItemsWithDetails = await Promise.all(
            delivery.delivery_items.map(async (deliveryItem) => {
                const inventory = await models.inventories.findOne({
                    where: {
                        warehouse_id: delivery.wh_id,
                        item_id: deliveryItem.inv_item_id,
                    },
                });

                // Fetch inventory item details
                const inventoryItem = await models.inventory_items.findByPk(deliveryItem.inv_item_id);

                return {
                    ...deliveryItem.dataValues,
                    inventory: inventory || null,
                    inventoryItem: inventoryItem || null,
                };
            })
        );

        // Send the retrieved delivery data with delivery items, inventory, inventory item details, and customer details to the front end
        return res.status(200).json({ delivery: { ...delivery.dataValues, deliveryItems: deliveryItemsWithDetails } });
    } catch (error) {
        console.error('Error retrieving delivery data:', error);
        return res.status(500).json({ message: 'Error retrieving delivery data' });
    }
};

const updateDeliveredQuantity = async (req, res) => {
    try {
        const { item_id, delivered_qty } = req.body;

        if (!item_id || delivered_qty === undefined) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        const deliveryItem = await models.delivery_items.findByPk(item_id);

        if (!deliveryItem) {
            return res.status(404).json({ message: 'Delivery item not found' });
        }

        // Update the delivered_quantity for the delivery item
        await deliveryItem.update({ delivered_quantity: delivered_qty });

        // Return a success response
        return res.status(200).json({ message: 'Delivered quantity updated successfully' });
    } catch (error) {
        console.error('Error updating delivered quantity:', error);
        return res.status(500).json({ message: 'Error updating delivered quantity' });
    }
};







// correct1
// const partialDelivery = async (req, res) => {
//     try {
//         // Get the delivery ID from the request
//         const { delivery_id } = req.body;
//
//         // Find the delivery to get the associated sales order ID (so_id)
//         const delivery = await models.deliveries.findByPk(delivery_id);
//
//         if (!delivery) {
//             return res.status(404).json({ message: 'Delivery not found' });
//         }
//
//         // Get the associated sales order ID
//         const salesOrderId = delivery.so_id;
//
//         // Find all delivery items for the specified sales order
//         const deliveryItems = await models.delivery_items.findAll({
//             where: {
//                 so_id: salesOrderId,
//             },
//         });
//
//         // Update remaining_quantity for each delivery item
//         const updateDeliveredQuantities = async (deliveryItems, salesOrderId) => {
//             for (const deliveryItem of deliveryItems) {
//                 // Calculate the sum of delivered_quantity for this delivery item
//                 const deliveredQuantitySum = deliveryItems
//                     .filter((item) => item.inv_item_id === deliveryItem.inv_item_id)
//                     .reduce((sum, item) => sum + item.delivered_quantity, 0);
//
//                 // Calculate the updated remaining_quantity
//                 const remainingQuantity = deliveryItem.so_quantity - deliveredQuantitySum;
//
//                 // Update the remaining_quantity in the database for this delivery item
//                 await deliveryItem.update({ remaining_quantity: remainingQuantity });
//
//                 // Find the corresponding sales_order_items entry for this item
//                 const salesOrderItem = await models.so_items.findOne({
//                     where: {
//                         so_id: salesOrderId,
//                         inv_item_id: deliveryItem.inv_item_id,
//                     },
//                 });
//
//                 if (salesOrderItem) {
//                     // Update the delivered_qty in the sales_order_items table
//                     await salesOrderItem.update({ delivered_qty: deliveredQuantitySum });
//
//                     // Check if the sales order item should be closed
//                     if (salesOrderItem.quantity === deliveredQuantitySum) {
//                         // Update the status column on the sales_order_items table to closed
//                         await salesOrderItem.update({ status: 'closed' });
//                     }
//                 }
//             }
//         };
//
//         await updateDeliveredQuantities(deliveryItems, salesOrderId);
//
//         // Update the status column on the deliveries table to closed
//         await delivery.update({ status: 'closed' });
//
//         res.status(200).json({ message: 'Remaining quantities updated successfully' });
//     } catch (error) {
//         console.error('Error updating remaining quantities:', error);
//         res.status(500).json({ message: 'Error updating remaining quantities' });
//     }
// };

const delivery = async (req, res) => {
    try {
        // Get the delivery ID and tenant ID from the request body
        const { delivery_id, tenant_id } = req.body;

        // Find the delivery to get the associated sales order ID (so_id) and warehouse ID (wh_id)
        const delivery = await models.deliveries.findOne({
            where: {
                id: delivery_id,
                tenant_id: tenant_id,
            },
        });

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Check if the delivery is already closed
        if (delivery.status === 'closed') {
            return res.status(400).json({ message: 'Delivery is already closed' });
        }

        // Get the associated sales order ID and warehouse ID
        const salesOrderId = delivery.so_id;
        const warehouseId = delivery.wh_id;

        // Find all delivery items for the specified sales order
        const deliveryItems = await models.delivery_items.findAll({
            where: {
                so_id: salesOrderId,
                tenant_id: tenant_id,
            },
        });

        for (const deliveryItem of deliveryItems) {
            // Calculate the sum of delivered_quantity for this delivery item
            const deliveredQuantitySum = deliveryItems
                .filter((item) => item.inv_item_id === deliveryItem.inv_item_id)
                .reduce((sum, item) => sum + item.delivered_quantity, 0);

            // Calculate the updated remaining_quantity
            const remainingQuantity = deliveryItem.so_quantity - deliveredQuantitySum;

            // Update the remaining_quantity in the database for this delivery item
            await deliveryItem.update({ remaining_quantity: remainingQuantity });

            // Find the corresponding sales_order_items entry for this item
            const salesOrderItem = await models.so_items.findOne({
                where: {
                    so_id: salesOrderId,
                    inv_item_id: deliveryItem.inv_item_id,
                    tenant_id: tenant_id,
                },
            });

            if (salesOrderItem) {
                // Update the delivered_qty in the sales_order_items table
                await salesOrderItem.update({ delivered_qty: deliveredQuantitySum, status: 'closed' });
            }

            // Update the inventories table
            const inventoryItem = await models.inventories.findOne({
                where: {
                    tenant_id: tenant_id,
                    item_id: deliveryItem.inv_item_id,
                    warehouse_id: warehouseId,
                },
            });

            if (inventoryItem) {
                const currentCommittedQuantity = inventoryItem.committed || 0;
                const currentAvailableQuantity = inventoryItem.available || 0;
                const currentInStockQuantity = inventoryItem.in_stock || 0;

                // Update the committed, available, and in_stock columns
                const updatedCommittedQuantity = currentCommittedQuantity - deliveryItem.so_quantity;
                const updatedAvailableQuantity = currentAvailableQuantity + (deliveryItem.so_quantity - deliveredQuantitySum);
                const updatedInStockQuantity = currentInStockQuantity - deliveredQuantitySum;

                await inventoryItem.update({
                    committed: updatedCommittedQuantity,
                    available: updatedAvailableQuantity,
                    in_stock: updatedInStockQuantity,
                });
            }
        }

        // Update the status column on the deliveries table to closed
        await delivery.update({ status: 'closed' });

        res.status(200).json({ message: 'Remaining quantities, inventory items, and sales order items updated successfully' });
    } catch (error) {
        console.error('Error updating remaining quantities, inventory items, and sales order items:', error);
        res.status(500).json({ message: 'Error updating remaining quantities, inventory items, and sales order items' });
    }
};










module.exports = {
    getVendors,
    createDelivery,
    getItemGroups,
    getManufacturers,
    getItemProperties,
    getWarehouses,
    addItem,
    getInventory,
    updateInventoryItem,
    getStockData,
    updateInventoryForGoodsReceipt,
    getDeliveryById,
    updateDeliveredQuantity,
    delivery
    // partialDelivery
}