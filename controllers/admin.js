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
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllTenants = async(req, res, next) => {
    try {
        const tenants = await models.tenants.findAll();
        res.status(200).json(tenants);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateTenant = async(req, res, next) => {
    const tenantId = req.params.id;
    const dataToUpdate = req.body;
    try {
        const tenant = await models.tenants.findByPk(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        // Update the item with the new data
        const updatedTenant = await tenant.update(dataToUpdate);

        res.send({message: 'Tenant details have been updated', data: updatedTenant})
    } catch (error) {
        res.status(500).json({ message: 'Error updating tenant' });
        console.log(error)
    }
}

const getUserAccountsByTenant = async(req, res, next) => {
    const tenant_id = req.params.id;
    const dataToUpdate = req.body
    try {
        // Find all posts associated with the provided userId and tenantId
        const users = await models.users.findAll({
            where: {
                tenant_id,
            },
        });
        console.log(users)
        res.send({message: 'User accounts have been fetched successfully', data: users});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tenants' });
        console.log(error)
    }
}

module.exports = {
    createTenant,
    getAllTenants,
    updateTenant,
    getUserAccountsByTenant
}
