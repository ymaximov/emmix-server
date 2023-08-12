const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

const secretKey = process.env.CRYPTO_SECRET;

const addNewVendor = async(req, res, next) => {
    try {
        const {
            tax_id,
            company_name,
            email,
            first_name,
            last_name,
            phone_1,
            fax,
            industry,
            sales_tax,
            vendor_type,
            payment_terms,
            country,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            contact_name,
            contact_phone,
            tenant_id,
        } = req.body

        console.log('***REQUEST BODY****', req.body)

        console.log('***TENANT ID', req.body.tenant_id)
        const salesTax = sales_tax == '' ? null : sales_tax
        const vendorType = vendor_type == '' ? null : vendor_type
        const newVendor = await models.vendors.create({
            tax_id,
            tenant_id,
            company_name,
            email,
            first_name,
            last_name,
            phone_1,
            fax,
            industry,
            sales_tax: salesTax,
            vendor_type: vendorType,
            payment_terms,
            country,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            contact_name,
            contact_phone,
        });
        res.status(200).send({message: 'Vendor created successfully', success: true})
        console.log('new vendor has been created')

    } catch (error) {
        res.status(500).send({message: 'Error creating vendor', success: false, error});
        console.log('***ERROR***', error)
    }
}

const getVendorsByTenant = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        const vendors = await models.vendors.findAll({
            where: {
                tenant_id,
            },
        });
        res.status(200).send({message: 'Vendors have been fetched successfully', data: vendors});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors' });
        console.log(error)
    }
}

const updateVendor = async(req, res, next) => {
    try {
        const {
            id,
            tenant_id,
            company_name,
            first_name,
            last_name,
            email,
            phone_1,
            fax,
            industry,
            vendor_type,
            payment_terms,
            tax_id,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            sales_tax,
            status,
            contact_phone
        } = req.body;
        console.log('***REQUEST BODY****', req.body);

        const options = {
            where: {
                id
            },
        }
        const vendor = await models.vendors.findOne(options)

        const vendorType = vendor_type == null ? null : vendor_type
        // req.body.password = hashedPassword;

        console.log('***TENANT ID', tenant_id)

        const updateVendor = await vendor.update({
            tenant_id,
            company_name,
            first_name,
            last_name,
            email,
            phone_1,
            fax,
            industry,
            contact_phone,
            vendor_type: vendorType,
            payment_terms,
            status,
            tax_id,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            tax_id

        });
        res.status(200).send({message: 'Vendor updated successfully', success: true})
        console.log('vendor has been updated')

    } catch (error) {
        res.status(500).send({message: 'Error updating vendor', success: false, error});
        console.log('***ERROR***', error)
    }
}

module.exports = {
    addNewVendor,
    getVendorsByTenant,
    updateVendor
}