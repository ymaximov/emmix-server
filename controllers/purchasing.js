const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

// const createPO = async (req, res) => {
//     try {
//         const purchaseOrderData = req.body;
//
//         console.log(req.body, 'REQ BODY')
//
//         // Insert into purchaseorder table
//         const createdPurchaseOrder = await models.purchase_orders.create({
//             tenant_id: purchaseOrderData.tenant_id,
//             vendor_id: purchaseOrderData.vendor_id,
//             user_id: purchaseOrderData.user_id,
//             warehouse_id: purchaseOrderData.warehouse_id,
//             // order_date: purchaseOrderData.order_date,
//             due_date: purchaseOrderData.due_date,
//             // status: purchaseOrderData.status,
//             sales_tax: purchaseOrderData.sales_tax,
//             subtotal: purchaseOrderData.subtotal,
//             total_amount: purchaseOrderData.total_amount
//         });
//
//         const poId = createdPurchaseOrder.id; // Assuming your model has an 'id' field
//
//
//         // Insert each item into purchaseorderitem table
//         for (const item of purchaseOrderData.items) {
//             const totalPrice = item.price * item.quantity;
//            await models.purchase_order_items.create({
//                 tenant_id: purchaseOrderData.tenant_id,
//                 po_id: poId,
//                 inv_item_id: item.inv_item_id,
//                 quantity: item.quantity,
//                 unit_price: item.price,
//                 total_price: totalPrice
//             });
//         }
//
//         // Calculate total_amount and total_price
//         const items = await models.purchase_order_items.findAll({
//             where: { po_id: poId },
//         });
//
//
//
//         // // Update the purchase order with total_amount and total_price
//         // await createdPurchaseOrder.update({
//         //     total_price: totalPrice,
//         // });
// const data = {
//     createdPurchaseOrder, items
// }
//
//         res.status(200).json({ message: 'Purchase order created successfully', data: poId})
//     } catch (error) {
//         console.error('Error creating purchase order:', error);
//         res.status(500).json({ error: 'Please fill out all required data' });
//     }
// };

const createPO = async (req, res) => {
    try {
        const purchaseOrderData = req.body;
        console.log(purchaseOrderData, 'REQ BODY')

        // Insert into purchaseorder table
        const createdPurchaseOrder = await models.purchase_orders.create({
            tenant_id: purchaseOrderData.tenant_id,
            vendor_id: purchaseOrderData.vendor_id,
            user_id: purchaseOrderData.user_id,
            warehouse_id: purchaseOrderData.warehouse_id,
            due_date: purchaseOrderData.due_date,
            sales_tax: purchaseOrderData.sales_tax,
            subtotal: purchaseOrderData.subtotal,
            total_amount: purchaseOrderData.total_amount,
            reference: purchaseOrderData.reference
        });
        console.log('PO CREATED SUCCESS')

        const poId = createdPurchaseOrder.id; // Assuming your model has an 'id' field

        // Insert each item into purchaseorderitem table and update inventory if needed
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

            console.log('PO ITEMS CREATED SUCCESS')

            // Check if inventory_item is true for the item_id in the 'inventory_items' table
            const inventoryItem = await models.inventory_items.findOne({
                where: { id: item.inv_item_id, inventory_item: true }
            });

            if (inventoryItem) {
                console.log('INV ITEM FOUND')
                // Check if an inventory record already exists for the warehouse_id
                const existingInventory = await models.inventories.findOne({
                    where: {
                        item_id: item.inv_item_id,
                        warehouse_id: purchaseOrderData.warehouse_id
                    }
                });
                console.log('DONE!!! line 114')

                if (existingInventory) {
                    // Update the existing inventory by adding the new quantity
                    await models.inventories.update(
                        {
                            ordered: existingInventory.ordered + item.quantity
                        },
                        {
                            where: {
                                item_id: item.inv_item_id,
                                warehouse_id: purchaseOrderData.warehouse_id
                            }
                        }
                    );
                } else {
                    // Create a new inventory record for the warehouse
                    await models.inventories.create({
                        tenant_id: purchaseOrderData.tenant_id,
                        warehouse_id: purchaseOrderData.warehouse_id,
                        item_id: item.inv_item_id,
                        ordered: item.quantity
                    });
                }
            }
        }

        const data = {
            createdPurchaseOrder,
            items: purchaseOrderData.items
        };

        res.status(200).json({ message: 'Purchase order created successfully', data: poId });
    } catch (error) {
        console.error('Error creating purchase order:', error);
        res.status(500).json({ error: 'Please fill out all required data' });
    }
};


const getPODataByPOID = async (req, res, next) => {
    const po_id = req.params.id; // Assuming you have a route parameter for po_id
    console.log(po_id, 'PO_ID');

    try {
        // Fetch the specific purchase order based on id and include vendor and warehouse details
        const purchaseOrder = await models.purchase_orders.findOne({
            where: {
                id: po_id,
            },
            include: [
                {
                    model: models.vendors,
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
                    model: models.warehouses,
                    // as: 'warehouses', // Alias for the included warehouse details
                },
                // {
                //     model: models.inventory_items,
                //     // as: 'warehouses', // Alias for the included warehouse details
                // },
                {
                    model: models.purchase_order_items,
                    include: [
                        {
                            model: models.inventory_items,
                            // as: 'inventories', // Alias for the included inventory item details
                        },
                    ],
                },
            ],
        });

        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase Order not found' });
        }

        res.status(200).send({
            message: 'Purchase Order, Items, and Details have been fetched successfully',
            purchaseOrder,
        });
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Purchase Order, Items, and Details' });
        console.error(error, 'ERROR');
    }
};
// const addItemToPurchaseOrder = async (req, res) => {
//     try {
//         const purchaseOrderId = req.body.po_id;
//         const newItemData = req.body;
//         console.log(req.body, 'Req Body')
//
//         // Calculate the total_price for the new item
//         const newItemTotalPrice = newItemData.unit_price * newItemData.quantity;
//
//         // Insert the new item into the purchase_order_items table
//         const createdItem = await models.purchase_order_items.create({
//             tenant_id: newItemData.tenant_id,
//             po_id: purchaseOrderId,
//             inv_item_id: newItemData.inv_item_id,
//             quantity: newItemData.quantity,
//             unit_price: newItemData.unit_price,
//             total_price: newItemTotalPrice,
//         });
//         console.log('crreated PO Item')
//
//         // Fetch all items for the corresponding purchase order
//         const items = await models.purchase_order_items.findAll({
//             where: { po_id: purchaseOrderId },
//         });
//
//         // Calculate the new subtotal for the purchase order
//         const newSubtotal = items.reduce((subtotal, item) => subtotal + item.total_price, 0);
//
//         // Update the purchase order with the new subtotal and total_amount
//         const purchaseOrder = await models.purchase_orders.findByPk(purchaseOrderId);
//         if (!purchaseOrder) {
//             return res.status(404).json({ error: 'Purchase order not found' });
//         }
//
//         await purchaseOrder.update({
//             subtotal: newSubtotal,
//             total_amount: newSubtotal + purchaseOrder.sales_tax,
//         });
//         console.log('updated subtotal')
//
//         // Check if the item exists in the inventories table for the specific warehouse
//         const inventoryItem = await models.inventory_items.findOne({
//             where: {
//                 tenant_id: newItemData.tenant_id,
//                 id: newItemData.inv_item_id,
//             },
//         });
//
//         if (inventoryItem && inventoryItem.inventory_item) {
//             // Item is an inventory item, add/update data in the inventories table
//             const inventoryData = await models.inventories.findOne({
//                 where: {
//                     tenant_id: newItemData.tenant_id,
//                     item_id: newItemData.inv_item_id,
//                     warehouse_id: newItemData.warehouse_id,
//                 },
//             });
//
//             if (inventoryData) {
//                 // Item exists in inventories, update the quantity
//                 await inventoryData.update({
//                     quantity: inventoryData.quantity + newItemData.quantity,
//                 });
//             } else {
//                 // Item doesn't exist in inventories, create a new entry
//                 await models.inventories.create({
//                     tenant_id: newItemData.tenant_id,
//                     item_id: newItemData.inv_item_id,
//                     warehouse_id: newItemData.warehouse_id,
//                     ordered: newItemData.quantity,
//                     // Other columns as needed
//                 });
//             }
//         }
//
//         res.status(200).json({ message: 'Item added to purchase order successfully', data: createdItem });
//     } catch (error) {
//         console.error('Error adding item to purchase order:', error);
//         res.status(500).json({ error: 'Failed to add item to purchase order' });
//     }
// };

const addItemToPurchaseOrder = async (req, res) => {
    try {
        const purchaseOrderId = req.body.po_id;
        const newItemData = req.body;
        console.log(req.body, 'Req Body')

        // Calculate the total_price for the new item
        const newItemTotalPrice = newItemData.unit_price * newItemData.quantity;

        // Insert the new item into the purchase_order_items table
        const createdItem = await models.purchase_order_items.create({
            tenant_id: newItemData.tenant_id,
            po_id: purchaseOrderId,
            inv_item_id: newItemData.inv_item_id,
            quantity: newItemData.quantity,
            unit_price: newItemData.unit_price,
            total_price: newItemTotalPrice,
        });
        console.log('created PO Item')

        // Fetch all items for the corresponding purchase order
        const items = await models.purchase_order_items.findAll({
            where: { po_id: purchaseOrderId },
        });

        // Calculate the new subtotal for the purchase order
        const newSubtotal = items.reduce((subtotal, item) => subtotal + item.total_price, 0);

        // Update the purchase order with the new subtotal and total_amount
        const purchaseOrder = await models.purchase_orders.findByPk(purchaseOrderId);
        if (!purchaseOrder) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        await purchaseOrder.update({
            subtotal: newSubtotal,
            total_amount: newSubtotal + purchaseOrder.sales_tax,
        });
        console.log('updated subtotal')

        // Check if the item exists in the inventories table for the specific warehouse
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                tenant_id: newItemData.tenant_id,
                id: newItemData.inv_item_id,
            },
        });

        if (inventoryItem && inventoryItem.inventory_item) {
            // Item is an inventory item, add/update data in the inventories table
            const inventoryData = await models.inventories.findOne({
                where: {
                    tenant_id: newItemData.tenant_id,
                    item_id: newItemData.inv_item_id,
                    warehouse_id: newItemData.warehouse_id,
                },
            });

            if (inventoryData) {
                // Item exists in inventories, update the quantity
                const currentOrderedQuantity = inventoryData.ordered || 0;
                await inventoryData.update({
                    ordered: currentOrderedQuantity + newItemData.quantity,
                });
            } else {
                // Item doesn't exist in inventories, create a new entry
                await models.inventories.create({
                    tenant_id: newItemData.tenant_id,
                    item_id: newItemData.inv_item_id,
                    warehouse_id: newItemData.warehouse_id,
                    ordered: newItemData.quantity,
                    // Other columns as needed
                });
            }
        }

        res.status(200).json({ message: 'Item added to purchase order successfully', data: createdItem });
    } catch (error) {
        console.error('Error adding item to purchase order:', error);
        res.status(500).json({ error: 'Failed to add item to purchase order' });
    }
};



const updatePurchaseOrderItem = async (req, res) => {
    try {
        const itemId = req.body.item_id;
        const invItemId = req.body.inv_item_id;
        const updatedItemData = req.body;
        console.log(updatedItemData, 'Updated Item Data');

        // Fetch the purchase order item for the specific item and purchase order
        const purchaseOrderItem = await models.purchase_order_items.findOne({
            where: {
                id: itemId,
            },
            include: [
                {
                    model: models.purchase_orders,
                    where: {
                        status: 'open',
                    },
                },
            ],
        });

        if (!purchaseOrderItem) {
            return res.status(404).json({ error: 'Purchase order item not found' });
        }

        // Fetch the current quantity from the purchase order item
        const currentQuantity = purchaseOrderItem.quantity;

        // Check if the item is an inventory item
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                id: invItemId,
            },
        });

        if (inventoryItem && inventoryItem.inventory_item) {
            // Fetch the current quantity from the inventories table for the specific item, warehouse, and tenant
            const { tenant_id, warehouse_id } = updatedItemData;

            let inventoryData = await models.inventories.findOne({
                where: {
                    tenant_id,
                    item_id: invItemId,
                    warehouse_id,
                },
            });

            if (!inventoryData) {
                return res.status(404).json({ error: 'Inventory data not found' });
            }

            // Subtract the current quantity of the purchase order for that item from the ordered column in inventories
            inventoryData.ordered -= currentQuantity;

            // Save the updated inventory data with the subtracted quantity
            await inventoryData.save();

            // Calculate the new total_price based on the NEW quantity from the frontend
            const newTotalPrice = updatedItemData.unit_price * updatedItemData.quantity;

            // Update the purchase order item with the new data
            await purchaseOrderItem.update({
                unit_price: updatedItemData.unit_price,
                quantity: updatedItemData.quantity,
                total_price: newTotalPrice, // Updated based on the NEW quantity
            });

            // Fetch all purchase order items for the specific item
            const purchaseOrderItems = await models.purchase_order_items.findAll({
                where: {
                    inv_item_id: invItemId,
                },
                include: [
                    {
                        model: models.purchase_orders,
                        where: {
                            status: 'open',
                        },
                    },
                ],
            });

            // Calculate the total ordered quantity from all open purchase orders for the specific item
            const totalOrderedQuantity = purchaseOrderItems.reduce((totalQuantity, item) => {
                // Add the quantity of the item in this purchase order item to the total
                return totalQuantity + item.quantity;
            }, 0);

            // Add the new totalOrderedQuantity to the "ordered" column in inventories
            inventoryData.ordered += totalOrderedQuantity;

            // Save the updated inventory data with the added quantity
            await inventoryData.save();
        } else {
            // If it's not an inventory item, update the quantity in purchase_order_items only
            await purchaseOrderItem.update({
                unit_price: updatedItemData.unit_price,
                quantity: updatedItemData.quantity,
                total_price: updatedItemData.unit_price * updatedItemData.quantity, // Calculate total_price based on the NEW quantity
            });
        }

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating purchase order item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};



// const updatePurchaseOrderItem = async (req, res) => {
//     try {
//         const itemId = req.body.item_id;
//         const invItemId = req.body.inv_item_id;
//         const updatedItemData = req.body;
//         console.log(updatedItemData, 'Updated Item Data');
//
//         // Fetch the purchase order item for the specific item and purchase order
//         const purchaseOrderItem = await models.purchase_order_items.findOne({
//             where: {
//                 id: itemId,
//             },
//             include: [
//                 {
//                     model: models.purchase_orders,
//                     where: {
//                         status: 'open',
//                     },
//                 },
//             ],
//         });
//
//         if (!purchaseOrderItem) {
//             return res.status(404).json({ error: 'Purchase order item not found' });
//         }
//
//         // Fetch the current quantity from the purchase order item
//         const currentQuantity = purchaseOrderItem.quantity;
//
//         // Check if the item is an inventory item
//         const inventoryItem = await models.inventory_items.findOne({
//             where: {
//                 id: invItemId,
//                 inventory_item: true, // Check if it's an inventory item
//             },
//         });
//
//         if (inventoryItem) {
//             // Fetch the current quantity from the inventories table for the specific item, warehouse, and tenant
//             const { tenant_id, warehouse_id } = updatedItemData;
//
//             let inventoryData = await models.inventories.findOne({
//                 where: {
//                     tenant_id,
//                     item_id: invItemId,
//                     warehouse_id,
//                 },
//             });
//
//             if (!inventoryData) {
//                 return res.status(404).json({ error: 'Inventory data not found' });
//             }
//
//             // Subtract the current quantity of the purchase order for that item from the ordered column in inventories
//             inventoryData.ordered -= currentQuantity;
//
//             // Save the updated inventory data with the subtracted quantity
//             await inventoryData.save();
//
//             // Calculate the new total_price based on the NEW quantity from the frontend
//             const newTotalPrice = updatedItemData.unit_price * updatedItemData.quantity;
//
//             // Update the purchase order item with the new data
//             await purchaseOrderItem.update({
//                 unit_price: updatedItemData.unit_price,
//                 quantity: updatedItemData.quantity,
//                 total_price: newTotalPrice, // Updated based on the NEW quantity
//             });
//
//             // Fetch all purchase order items for the specific item
//             const purchaseOrderItems = await models.purchase_order_items.findAll({
//                 where: {
//                     inv_item_id: invItemId,
//                 },
//                 include: [
//                     {
//                         model: models.purchase_orders,
//                         where: {
//                             status: 'open',
//                         },
//                     },
//                 ],
//             });
//
//             // Calculate the total ordered quantity from all open purchase orders for the specific item
//             const totalOrderedQuantity = purchaseOrderItems.reduce((totalQuantity, item) => {
//                 // Add the quantity of the item in this purchase order item to the total
//                 return totalQuantity + item.quantity;
//             }, 0);
//
//             // Add the new totalOrderedQuantity to the "ordered" column in inventories
//             inventoryData.ordered += totalOrderedQuantity;
//
//             // Save the updated inventory data with the added quantity
//             await inventoryData.save();
//         }
//
//         res.status(200).json({ message: 'Item updated successfully' });
//     } catch (error) {
//         console.error('Error updating purchase order item:', error);
//         res.status(500).json({ error: 'Failed to update item' });
//     }
// };







// const updatePurchaseOrderItem = async (req, res) => {
//     try {
//         const itemId = req.body.item_id;
//         const invItemId = req.body.inv_item_id;
//         const updatedItemData = req.body;
//         console.log(updatedItemData, 'Updated Item Data');
//
//         // Fetch the purchase order item for the specific item and purchase order
//         const purchaseOrderItem = await models.purchase_order_items.findOne({
//             where: {
//                 id: itemId,
//             },
//             include: [
//                 {
//                     model: models.purchase_orders,
//                     where: {
//                         status: 'open',
//                     },
//                 },
//             ],
//         });
//
//         if (!purchaseOrderItem) {
//             return res.status(404).json({ error: 'Purchase order item not found' });
//         }
//
//         // Calculate the new total_price for the purchase order item
//         const newTotalPrice = updatedItemData.unit_price * updatedItemData.quantity;
//
//         // Update the purchase order item with the new data
//         await purchaseOrderItem.update({
//             unit_price: updatedItemData.unit_price,
//             quantity: updatedItemData.quantity,
//             total_price: newTotalPrice,
//         });
//
//         // Fetch all purchase order items for the specific item
//         const purchaseOrderItems = await models.purchase_order_items.findAll({
//             where: {
//                 inv_item_id: invItemId,
//             },
//             include: [
//                 {
//                     model: models.purchase_orders,
//                     where: {
//                         status: 'open',
//                     },
//                 },
//             ],
//         });
//
//         // Calculate the total ordered quantity from all open purchase orders for the specific item
//         const totalOrderedQuantity = purchaseOrderItems.reduce((totalQuantity, item) => {
//             // Add the quantity of the item in this purchase order item to the total
//             return totalQuantity + item.quantity;
//         }, 0);
//
//         // Check if the item is an inventory item
//         const inventoryItem = await models.inventory_items.findOne({
//             where: {
//                 id: invItemId,
//                 inventory_item: true, // Check if it's an inventory item
//             },
//         });
//
//         if (inventoryItem) {
//             // Fetch the current quantity from the inventories table for the specific item and warehouse
//             const { tenant_id, warehouse_id } = updatedItemData;
//
//             const inventoryData = await models.inventories.findOne({
//                 where: {
//                     tenant_id,
//                     item_id: invItemId,
//                     warehouse_id,
//                 },
//             });
//
//             if (!inventoryData) {
//                 return res.status(404).json({ error: 'Inventory data not found' });
//             }
//
//             // Update the "ordered" column in the inventories table with the calculated total ordered quantity
//             await inventoryData.update({
//                 ordered: totalOrderedQuantity,
//             });
//
//             console.log('updated ordered quantity');
//         }
//
//         res.status(200).json({ message: 'Item updated successfully' });
//     } catch (error) {
//         console.error('Error updating purchase order item:', error);
//         res.status(500).json({ error: 'Failed to update item' });
//     }
// };








const deletePurchaseOrderItem = async (req, res) => {
    try {
        console.log('Start');
        const { quantity, inv_item_id, warehouse_id, tenant_id, itemId } = req.query; // Quantity and other relevant data
        // Fetch the item from the purchase_order_items table
        console.log(quantity, inv_item_id, warehouse_id, tenant_id, req.query, 'PARAMS');
        const itemToDelete = await models.purchase_order_items.findByPk(itemId);

        if (!itemToDelete) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Delete the item from the purchase_order_items table
        await itemToDelete.destroy();

        // Fetch all items for the corresponding purchase order
        const items = await models.purchase_order_items.findAll({
            where: { po_id: itemToDelete.po_id },
        });

        // Calculate the new subtotal for the purchase order
        const newSubtotal = items.reduce((subtotal, item) => subtotal + item.total_price, 0);

        // Update the purchase order with the new subtotal and total_amount
        const purchaseOrder = await models.purchase_orders.findByPk(itemToDelete.po_id);
        if (!purchaseOrder) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        await purchaseOrder.update({
            subtotal: newSubtotal,
            total_amount: newSubtotal + purchaseOrder.sales_tax,
        });
        console.log('PO UPDATEED')
        // Check if the item is an inventory item
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                id: inv_item_id,
                inventory_item: true, // Check if it's an inventory item
            },
        });

        if (inventoryItem) {
            // Subtract the quantity from the "ordered" column in the inventories table
            const inventoryData = await models.inventories.findOne({
                where: {
                    tenant_id,
                    item_id: inv_item_id,
                    warehouse_id,
                },
            });

            if (!inventoryData) {
                return res.status(404).json({ error: 'Inventory data not found' });
            }

            // Ensure that the quantity to subtract does not exceed the current "ordered" quantity
            const newOrderedQuantity = Math.max(0, inventoryData.ordered - quantity);

            // Update the "ordered" column in the inventories table
            await inventoryData.update({
                ordered: newOrderedQuantity,
            });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.log('there was an error');
        console.error('Error deleting purchase order item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};



const updatePurchaseOrder = async(req, res) => {
    const { warehouse_id, due_date, po_id } = req.body; // Get updated values from the request body
    console.log(warehouse_id, due_date, po_id, 'REQ BODY!!')

    try {
        // Find the purchase order by its ID
        const purchaseOrder = await models.purchase_orders.findByPk(po_id);

        if (!purchaseOrder) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        // Update the warehouse_id and due_date properties
        if (warehouse_id !== null) {
            purchaseOrder.warehouse_id = warehouse_id;
        } else {
            purchaseOrder.warehouse_id
        }
        if (due_date !== undefined) {
           purchaseOrder.due_date = due_date;
        } else {
            purchaseOrder.due_date
        }


        // Save the updated purchase order
        await purchaseOrder.save();
        console.log('SAVED')

        return res.status(200).json({ message: 'Purchase order updated successfully', data: purchaseOrder });
    } catch (error) {
        console.error('Error updating purchase order:', error);
        return res.status(500).json({ error: 'Failed to update purchase order' });
    }

    const getPurchaseOrdersByTenant = async (req, res) => {
        try {
            const tenantId = req.params.tenantId; // Assuming you pass the tenant ID in the URL

            // Fetch all purchase orders for the specific tenant and include related data
            const purchaseOrders = await models.purchase_orders.findAll({
                where: {
                    tenant_id: tenantId,
                },
                include: [
                    {
                        model: models.warehouses, // Include the related warehouses data
                        attributes: ['warehouse_name'], // Specify the columns to include
                    },
                    {
                        model: models.vendors, // Include the related vendors data
                        attributes: ['vendor_name'], // Specify the columns to include
                    },
                ],
            });

            // Return the purchase orders data as JSON response
            res.status(200).json({
                message: 'Purchase Orders Fetched Successfully',
                data: purchaseOrders,
            });
        } catch (error) {
            console.error('Error fetching purchase orders:', error);
            res.status(500).json({ message: 'Error fetching purchase orders' });
        }
    };

}

const getPurchaseOrdersByTenant = async (req, res) => {
    try {
        const tenantId = req.params.id
        console.log(tenantId, 'TENANT ID'); // Assuming you pass the tenant ID in the URL

        // Fetch all purchase orders for the specific tenant and include related data
        const purchaseOrders = await models.purchase_orders.findAll({
            where: {
                tenant_id: tenantId,
            },
            include: [
                {
                    model: models.warehouses, // Include the related warehouses data
                    attributes: ['warehouse_name'], // Specify the columns to include
                },
                {
                    model: models.vendors, // Include the related vendors data
                    attributes: ['company_name'], // Specify the columns to include
                },
                {
                    model: models.users, // Include the related users data
                    attributes: ['first_name', 'last_name', 'email'], // Specify the columns to include
                },
            ],
        });

        // Return the purchase orders data as JSON response
        res.status(200).json({
            message: 'Purchase Orders Fetched Successfully',
            data: purchaseOrders,
        });
    } catch (error) {
        console.error('Error fetching purchase orders:', error);
        res.status(500).json({ message: 'Error fetching purchase orders' });
    }
};


const convertPOToGoodsReceipt = async (req, res) => {
    const transaction = await models.sequelize.transaction();

    try {
        const { poNo, tenant_id, receiver_id } = req.body;

        let goodsReceipt;
        let goodsReceiptItems = []; // Define goodsReceiptItems in the outer scope

        // Find an existing goods receipt for the given purchase order (po_id)
        const existingGoodsReceipt = await models.goods_receipts.findOne({
            where: {
                po_id: poNo,
                tenant_id,
            },
        });

        if (existingGoodsReceipt) {
            // Fetch existing goods_receipt_items for this goods_receipt
            goodsReceipt = existingGoodsReceipt;

            // Fetch goods_receipt_items associated with the goods_receipt
            goodsReceiptItems = await models.goods_receipt_items.findAll({
                where: {
                    goods_receipt_id: goodsReceipt.id,
                    tenant_id,
                },
                include: [
                    {
                        model: models.inventory_items,
                        attributes: ['id', 'item_name', 'manuf_sku', 'barcode'],
                    },
                ],
            });
        } else {
            // Create a new goods receipt and use warehouse_id and vendor_id from the purchase order
            const purchaseOrder = await models.purchase_orders.findOne({
                where: {
                    id: poNo,
                    tenant_id,
                    status: 'open',
                },
            });

            if (!purchaseOrder) {
                await transaction.rollback();
                return res.status(404).json({ message: 'No open purchase orders found' });
            }

            goodsReceipt = await models.goods_receipts.create(
                {
                    tenant_id,
                    warehouse_id: purchaseOrder.warehouse_id,
                    vendor_id: purchaseOrder.vendor_id,
                    po_id: poNo,
                    receiver_id,
                    buyer_id: purchaseOrder.user_id,
                },
                { transaction }
            );

            // Fetch associated items for the purchase order, including the inventory_items data
            const items = await models.purchase_order_items.findAll({
                where: {
                    po_id: poNo,
                    tenant_id,
                },
                include: [
                    {
                        model: models.inventory_items,
                        attributes: ['id'],
                    },
                ],
            });

            // Create goods_receipt_items for each item
            const createdItems = [];
            for (const item of items) {
                const goodsReceiptItem = await models.goods_receipt_items.create(
                    {
                        tenant_id,
                        goods_receipt_id: goodsReceipt.id,
                        inv_item_id: item.inventory_item.id,
                        quantity: item.quantity,
                    },
                    { transaction }
                );

                // Include the ID of the item in the created goods_receipt_item
                goodsReceiptItem.dataValues.inventory_item_id = item.inventory_item.id;
                createdItems.push(goodsReceiptItem);
            }
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the goods_receipt_items again (including the newly created ones)
        goodsReceiptItems = await models.goods_receipt_items.findAll({
            where: {
                goods_receipt_id: goodsReceipt.id,
                tenant_id,
            },
            include: [
                {
                    model: models.inventory_items,
                    attributes: ['id', 'item_name', 'manuf_sku', 'barcode'],
                },
            ],
        });

        // Build the response object with the goodsReceipt, purchase_order, and user details
        const response = {
            message: existingGoodsReceipt ? 'Goods Receipt Fetched Successfully' : 'Goods Receipt Created Successfully',
            data: {
                goodsReceipt: {
                    ...goodsReceipt.toJSON(),
                    items: goodsReceiptItems.map((item) => ({
                        id: item.dataValues.inventory_item.id, // Include the ID of the item in the response
                        ...item.toJSON(),
                        inventory_item: item.inventory_item,
                    })),
                },
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching or creating goods receipt, or goods receipt items:', error);

        await transaction.rollback();

        res.status(500).json({ message: 'Error fetching or creating goods receipt, or goods receipt items' });
    }
};

const updateReceivedQuanitiy = async(req, res) => {
    try {
        const itemId = req.params.id;
        const { received_quantity, tenant_id } = req.body;

        const item = await models.goods_receipt_items.findOne({
            where: {
                id: itemId,
                tenant_id: tenant_id
            }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the received_quantity column
        item.received_quantity = received_quantity;
        await item.save();

        return res.status(200).json({ message: 'Received quantity updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const voidPO = async (req, res) => {
    try {
        // Assuming the request body contains an object with warehouse_id, tenant_id, items (an array of objects with inv_item_id and quantity), and purchaseOrderId
        const { warehouse_id, tenant_id, items, purchaseOrderId } = req.body;
        console.log(req.body, 'REQ BODY')

        if (!warehouse_id || !tenant_id || !items || !Array.isArray(items) || items.length === 0 || !purchaseOrderId) {
            return res.status(400).json({ message: 'Invalid or empty request body' });
        }

        // Iterate through the items and update the ordered column for each item
        for (const itemToUpdate of items) {
            const { inv_item_id, quantity } = itemToUpdate;

            // Check if the item is marked as an inventory item in the inventory_items table
            const isInventoryItem = await models.inventory_items.findOne({
                where: {
                    id: inv_item_id,
                },
            });

            if (!isInventoryItem) {
                return res.status(404).json({ message: `Inventory item with ID ${inv_item_id} not found.` });
            }

            if (isInventoryItem.inventory_item) {
                // Find the corresponding item in the inventories table
                const inventoryItem = await models.inventories.findOne({
                    where: {
                        item_id: inv_item_id,
                        warehouse_id,
                        tenant_id,
                    },
                });

                if (!inventoryItem) {
                    return res.status(404).json({ message: `Inventory item with Item ID ${inv_item_id}, Warehouse ID ${warehouse_id}, and Tenant ID ${tenant_id} not found.` });
                }

                // Update the ordered column by subtracting the quantity from the purchase_order_items table
                const purchaseOrderItem = await models.purchase_order_items.findOne({
                    where: {
                        po_id: purchaseOrderId,
                        inv_item_id,
                    },
                });

                if (!purchaseOrderItem) {
                    return res.status(404).json({ message: `Purchase order item with Item ID ${inv_item_id} and Purchase Order ID ${purchaseOrderId} not found.` });
                }

                // Subtract the quantity from the ordered column
                inventoryItem.ordered -= purchaseOrderItem.quantity;

                // Save the updated inventory item
                await inventoryItem.save();
                console.log('SAVED');
            }
        }

        // Update the purchase order status to "void" in the purchase_orders table
        const purchaseOrderToUpdate = await models.purchase_orders.findOne({
            where: {
                id: purchaseOrderId,
                tenant_id,
            },
        });
        console.log('PO UPDATED')
        if (!purchaseOrderToUpdate) {
            return res.status(404).json({ message: `Purchase order with ID ${purchaseOrderId} and Tenant ID ${tenant_id} not found.` });
        }

        // Update the status to "void" (assuming "void" is an enum value)
        purchaseOrderToUpdate.status = 'void';

        // Save the updated purchase order
        await purchaseOrderToUpdate.save();

        return res.status(200).json({ message: 'Purchase Order Has Been Voided' });
    } catch (error) {
        console.error('Error updating inventory ordered and voiding purchase order:', error);
        return res.status(500).json({ message: 'Error updating inventory ordered and voiding purchase order' });
    }
};



// const voidPO = async (req, res) => {
//     try {
//         // Assuming the request body contains an object with warehouse_id, tenant_id, items (an array of objects with inv_item_id and quantity), and purchaseOrderId
//         const { warehouse_id, tenant_id, items, purchaseOrderId } = req.body;
//         console.log(req.body, 'REQ BODY')
//
//         if (!warehouse_id || !tenant_id || !items || !Array.isArray(items) || items.length === 0 || !purchaseOrderId) {
//             return res.status(400).json({ message: 'Invalid or empty request body' });
//         }
//
//         // Fetch inventory item flags for all items from the inventory_items table
//         const itemFlags = await models.inventory_items.findAll({
//             where: {
//                 id: items.map(item => item.inv_item_id),
//             },
//         });
//
//         // Create a map to store the inventory item flags by inv_item_id
//         const itemFlagsMap = {};
//         itemFlags.forEach(itemFlag => {
//             itemFlagsMap[itemFlag.id] = itemFlag.inventory_item;
//         });
//
//         // Iterate through the items and update the ordered column for each item
//         for (const itemToUpdate of items) {
//             const { inv_item_id, quantity } = itemToUpdate;
//
//             // Check if the item is marked as an inventory item in the inventory_items table
//             const isInventoryItem = itemFlagsMap[inv_item_id];
//
//             if (isInventoryItem) {
//                 // Find the corresponding item in the inventories table
//                 const inventoryItem = await models.inventories.findOne({
//                     where: {
//                         item_id: inv_item_id,
//                         warehouse_id,
//                         tenant_id,
//                     },
//                 });
//
//                 if (!inventoryItem) {
//                     return res.status(404).json({ message: `Inventory item with Item ID ${inv_item_id}, Warehouse ID ${warehouse_id}, and Tenant ID ${tenant_id} not found.` });
//                 }
//
//                 // Update the ordered column by subtracting the quantity
//                 inventoryItem.ordered -= quantity;
//
//                 // Save the updated inventory item
//                 await inventoryItem.save();
//                 console.log('SAVED');
//             }
//         }
//
//         // Update the purchase order status to "void" in the purchase_orders table
//         const purchaseOrderToUpdate = await models.purchase_orders.findOne({
//             where: {
//                 id: purchaseOrderId,
//                 tenant_id,
//             },
//         });
//         console.log('PO UPDATED')
//         if (!purchaseOrderToUpdate) {
//             return res.status(404).json({ message: `Purchase order with ID ${purchaseOrderId} and Tenant ID ${tenant_id} not found.` });
//         }
//
//         // Update the status to "void" (assuming "void" is an enum value)
//         purchaseOrderToUpdate.status = 'void';
//
//         // Save the updated purchase order
//         await purchaseOrderToUpdate.save();
//
//         return res.status(200).json({ message: 'Purchase Order Has Been Voided' });
//     } catch (error) {
//         console.error('Error updating inventory ordered and voiding purchase order:', error);
//         return res.status(500).json({ message: 'Error updating inventory ordered and voiding purchase order' });
//     }
// };



module.exports = {
    createPO,
    getPODataByPOID,
    addItemToPurchaseOrder,
    updatePurchaseOrderItem,
    deletePurchaseOrderItem,
    updatePurchaseOrder,
    convertPOToGoodsReceipt,
getPurchaseOrdersByTenant,
    updateReceivedQuanitiy,
    voidPO
}