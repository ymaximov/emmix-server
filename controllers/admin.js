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

const resetPassword = async(req, res, next) => {
    try {
        const {email, password, confirm_password} = req.body;
        console.log('***REQUEST BODY****', req.body)
        const options = {
            where: {
                email
            },
        }
        const isPasswordMatch = password === confirm_password
        const user = await models.users.findOne(options)



        if (!user){
            console.log('there is no user')
            return res.status(403).send({message: 'User does not exist', success: false})
        } else if(!isPasswordMatch){
            console.log('passwords dont match')
            return res.status(409).send({message: 'Passwords do not match', success: false})
        } else {
        console.log('trying to update password')
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updatedPassword = await user.update({
                password: hashedPassword
            });
        console.log('updated password' , updatedPassword)
            res.status(200).send({message: 'password updated successfully', success: true})
        }
    } catch (error) {
        res.status(500).send({message: 'Error updating password', success: false, error});
        console.log('***ERROR***', error)
    }
}

module.exports = {
    createTenant,
    getAllTenants,
    updateTenant,
    getUserAccountsByTenant,
    resetPassword
}
