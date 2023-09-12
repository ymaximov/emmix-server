const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

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
        res.status(200).send({message: 'Inventory Items have been fetched successfully', data: inventoryItems});
        console.log('data pushed to front')
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
    const item_id = req.params.id;

    try {
        // Fetch all stock data for the given item_id
        const inventoryData = await models.inventories.findAll({
            where: {
                item_id,
            },
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

module.exports = {
    getVendors,
    getItemGroups,
    getManufacturers,
    getItemProperties,
    getWarehouses,
    addItem,
    getInventory,
    updateInventoryItem,
    getStockData
}