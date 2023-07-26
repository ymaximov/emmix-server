const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')

const addNewCustomer = async(req, res, next) => {
    try {
        const {
            tenant_id,
            company_name,
            first_name,
            last_name,
            email,
            phone_1,
            fax,
            industry,
            customer_type,
            payment_terms,
            late_interest,
            cc_number,
            cc_expiration,
            cc_security_code,
            cc_id,
            bank_country,
            bank_name,
            bank_code,
            bank_account_no,
            bic_swift,
            bank_account_name,
            bank_branch,
            bank_signature_date,
            remarks

        } = req.body;
        console.log('***REQUEST BODY****', req.body)

            const salt = await bcrypt.genSalt(10);
            const creditCard = cc_number == null ? null : await bcrypt.hash(cc_number, salt)
            const cvv = cc_security_code == null ? null : await bcrypt.hash(cc_security_code, salt)
            const bankAccountNo = bank_account_no == null ? null : await bcrypt.hash(bank_account_no, salt) ;
            const swift = bic_swift == null ? null : await bcrypt.hash(bic_swift, salt);

            // req.body.password = hashedPassword;

            console.log('***TENANT ID', tenant_id)

            const newCustomer = await models.customers.create({
                tenant_id,
                company_name,
                first_name,
                last_name,
                email,
                phone_1,
                fax,
                industry,
                customer_type,
                payment_terms,
                late_interest,
                cc_number: creditCard,
                cc_expiration,
                cc_security_code: cvv,
                cc_id,
                bank_country,
                bank_name,
                bank_code,
                bank_account_no: bankAccountNo,
                bic_swift: swift,
                bank_account_name,
                bank_branch,
                bank_signature_date,
                remarks
            });
            res.status(200).send({message: 'Customer created successfully', success: true})
        console.log('new customer has been created')

    } catch (error) {
        res.status(500).send({message: 'Error creating customer', success: false, error});
        console.log('***ERROR***', error)
    }
}

const getCustomersByTenant = async(req, res, next) => {
    const tenant_id = req.params.id;
    console.log(tenant_id, 'TENANTID')
    try {
        const customers = await models.customers.findAll({
            where: {
                tenant_id,
            },
        });
        console.log(customers)
        res.status(200).send({message: 'Customers have been fetched successfully', data: customers});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers' });
        console.log(error)
    }
}

module.exports = {
    addNewCustomer,
    getCustomersByTenant
}