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
            phone,
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
            const creditCard = await bcrypt.hash(cc_number, salt);
            const cvc = await bcrypt.hash(cc_security_code, salt);
            const bankAccountNo = await bcrypt.hash(bank_account_no, salt);
            const swift = await bcrypt.hash(bic_swift, salt);

            // req.body.password = hashedPassword;

            console.log('***TENANT ID', tenant_id)

            const newCustomer = await models.customers.create({
                tenant_id,
                company_name,
                first_name,
                last_name,
                email,
                phone,
                fax,
                industry,
                customer_type,
                payment_terms,
                late_interest,
                cc_number: creditCard,
                cc_expiration,
                cc_security_code: cvc,
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

module.exports = {
    addNewCustomer
}