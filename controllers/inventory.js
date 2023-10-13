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

const getInventory = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        const inventoryItems = await models.inventory_items.findAll({
            where: {
                tenant_id,
            },
        });
        console.log(inventoryItems, 'INV ITEMS')
        res.status(200).send({message: 'Inventory Items have been fetched successfully', data: inventoryItems});
        console.log('inv data pushed to frontkjnfndksnfj')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Inventory Items' });
        console.log(error)
    }
}






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
        const { goodsReceiptId, warehouseId } = req.body;

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
            const { inv_item_id, quantity, received_quantity } = goodsReceiptItem;

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
        const goodsReceiptToUpdate = await models.goods_receipts.findOne({
            where: {
                id: goodsReceiptId,
            },
        });

        if (!goodsReceiptToUpdate) {
            throw new Error(`Goods receipt with ID ${goodsReceiptId} not found.`);
        }

        // Update the status to "closed" (assuming "closed" is an enum value)
        goodsReceiptToUpdate.status = 'closed';

        // Save the updated goods receipt item
        await goodsReceiptToUpdate.save();

        // Find the corresponding purchase order based on po_id
        const purchaseOrder = await models.purchase_orders.findOne({
            where: {
                id: goodsReceiptToUpdate.po_id,
            },
        });

        if (!purchaseOrder) {
            throw new Error(`Purchase order with ID ${goodsReceiptToUpdate.po_id} not found.`);
        }

        // Update the status of the purchase order to "closed" (assuming "closed" is an enum value)
        purchaseOrder.status = 'closed';

        // Save the updated purchase order
        await purchaseOrder.save();

        // Return a success message or result if needed
        return res.status(200).json({ message: 'Inventory and purchase order updated successfully' });
    } catch (error) {
        console.error('Error updating inventory and purchase order:', error);
        return res.status(500).json({ message: 'Error updating inventory and purchase order' });
    }
};
const createDelivery = async (req, res) => {
    try {
        const { tenant_id, so_id, wh_id, picker_id } = req.body;

        if (!tenant_id || !so_id || !wh_id) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        // Check if there is an open delivery for the given sales order and warehouse
        const existingOpenDelivery = await models.deliveries.findOne({
            where: {
                so_id,
                wh_id,
                status: 'open',
            },
        });

        if (existingOpenDelivery) {
            // If an open delivery exists, return its data

            const existingDeliveryItems = await models.delivery_items.findAll({
                where: { delivery_id: existingOpenDelivery.id },
            });

            // Fetch customer details based on customer_id
            const customerDetails = await models.customers.findByPk(existingOpenDelivery.customer_id);

            const deliveryItemDetailsPromises = existingDeliveryItems.map(async (item) => {
                const inventoryItem = await models.inventory_items.findByPk(item.inv_item_id);
                return { ...item.dataValues, inventoryItem };
            });

            const deliveryItemDetails = await Promise.all(deliveryItemDetailsPromises);

            // Send the data to the front end with a status of 200
            return res.status(200).json({
                delivery: {
                    ...existingOpenDelivery.dataValues,
                    customerDetails,
                },
                deliveryItems: deliveryItemDetails,
            });
        }

        // Create a new delivery based on the sales order
        const salesOrder = await models.sales_orders.findByPk(so_id);

        if (!salesOrder) {
            return res.status(404).json({ message: `Sales Order with ID ${so_id} not found.` });
        }

        // Extract the 'invoiced' status from the sales order
        const { invoiced } = salesOrder;

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

        const salesOrderItems = await models.sales_order_items.findAll({
            where: {
                so_id,
                wh_id,
                status: 'open', // Ensure status is 'open' for sales order items
            },
        });

        for (const salesOrderItem of salesOrderItems) {
            const { inv_item_id, quantity } = salesOrderItem;
            const remainingQuantity = quantity;

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
                remaining_quantity: remainingQuantity,
            };

            const createdDeliveryItem = await models.delivery_items.create(newDeliveryItem);

            const inventoryItem = await models.inventory_items.findByPk(createdDeliveryItem.inv_item_id);

            newDeliveryItems.push({ ...createdDeliveryItem.dataValues, inventoryItem });
        }

        // Send the data to the front end with a status of 200
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
    updateInventoryForGoodsReceipt
}