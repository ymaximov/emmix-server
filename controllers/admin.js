const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')

const createTenant = async(req, res, next) => {
    console.log(req.body, 'form values from FE')
    try {
        const { company_name, email, first_name, last_name, phone, address_1, address_2, city, state, postal_code, country, security_code } = req.body;

        // Create a new user
        const tenant = await models.tenants.create({
            company_name, email, first_name, last_name, phone, address_1, address_2, city, state, postal_code, country, security_code
        });

        res.status(200)
            .send({message: 'Company has been successfully added'})
    } catch (error) {
        console.error('Error inserting tenant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createTenant
}
