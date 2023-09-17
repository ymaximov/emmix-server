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

module.exports = {
    createSalesQuotation
}