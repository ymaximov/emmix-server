const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')
const CryptoJS = require('crypto-js');

const secretKey = process.env.CRYPTO_SECRET

const addNewCustomer = async(req, res, next) => {
    try {
        const {
            tenant_id,
            company_name,
            first_name,
            last_name,
            email,
            tax_id,
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
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            bank_signature_date

        } = req.body;
        console.log('***REQUEST BODY****', req.body)

            const creditCard = cc_number == null ? null : CryptoJS.AES.encrypt(cc_number, secretKey).toString();
            const cvv = cc_security_code == null ? null : CryptoJS.AES.encrypt(cc_security_code, secretKey).toString();
            const bankAccountNo = bank_account_no == null ? null : CryptoJS.AES.encrypt(bank_account_no, secretKey).toString();
            const swift = bic_swift == null ? null : CryptoJS.AES.encrypt(bic_swift, secretKey).toString();
            const customerType = customer_type == null ? null : customer_type
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
                customer_type: customerType,
                payment_terms,
                late_interest,
                cc_number: creditCard,
                cc_expiration,
                cc_security_code: cvv,
                cc_id,
                bank_country,
                bank_name,
                bank_code,
                tax_id,
                bank_account_no: bankAccountNo,
                bic_swift: swift,
                bank_account_name,
                bank_branch,
                bank_signature_date,
                remarks,
                address_1,
                address_2,
                city,
                state,
                postal_code,
                country,
                bank_signature_date

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
    const decryptColumn = (encryptedData, decryptionKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    };
    try {
        const customers = await models.customers.findAll({
            where: {
                tenant_id,
            },
        });
        console.log('before', customers)
        const decryptedCustomers = customers.map((customer) => {
            // Assuming 'creditCard', 'ssn', and 'otherColumn' are encrypted columns in your database
            const decryptedCreditCard = decryptColumn(customer.cc_number, secretKey);
            const decryptedCCCode = decryptColumn(customer.cc_security_code, secretKey);
            const decryptedBankAccNo = decryptColumn(customer.bank_account_no, secretKey);
            const decryptedBicSwift = decryptColumn(customer.bic_swift, secretKey);

            // Include the decrypted values along with the rest of the customer data
            return {
                ...customer.toJSON(),
                cc_number: decryptedCreditCard,
                cc_security_code: decryptedCCCode,
                bank_account_no: decryptedBankAccNo,
                bic_swift: decryptedBicSwift,
            };
        });
        console.log(customers)
        console.log(decryptedCustomers)
        res.status(200).send({message: 'Customers have been fetched successfully', data: decryptedCustomers});
        console.log('data pushed to front')
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers' });
        console.log(error)
    }
}

const updateCustomer = async(req, res, next) => {
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
            tax_id,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            bank_signature_date,
            status
        } = req.body;
        console.log('***REQUEST BODY****', req.body);

        const options = {
            where: {
                id
            },
        }
        const customer = await models.customers.findOne(options)

        const creditCard = cc_number == null ? null : CryptoJS.AES.encrypt(cc_number, secretKey).toString();
        const cvv = cc_security_code == null ? null : CryptoJS.AES.encrypt(cc_security_code, secretKey).toString();
        const bankAccountNo = bank_account_no == null ? null : CryptoJS.AES.encrypt(bank_account_no, secretKey).toString();
        const swift = bic_swift == null ? null : CryptoJS.AES.encrypt(bic_swift, secretKey).toString();
        const customerType = customer_type == null ? null : customer_type
        // req.body.password = hashedPassword;

        console.log('***TENANT ID', tenant_id)

        const updateCustomer = await customer.update({
            tenant_id,
            company_name,
            first_name,
            last_name,
            email,
            phone_1,
            fax,
            industry,
            customer_type: customerType,
            payment_terms,
            late_interest,
            cc_number: creditCard,
            cc_expiration,
            cc_security_code: cvv,
            cc_id,
            bank_country,
            bank_name,
            bank_code,
            status,
            bank_signature_date,
            bank_account_no: bankAccountNo,
            bic_swift: swift,
            bank_account_name,
            bank_branch,
            bank_signature_date,
            tax_id,
            remarks,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country

        });
        res.status(200).send({message: 'Customer updated successfully', success: true})
        console.log('customer has been updated')

    } catch (error) {
        res.status(500).send({message: 'Error updating customer', success: false, error});
        console.log('***ERROR***', error)
    }
}

module.exports = {
    addNewCustomer,
    getCustomersByTenant,
    updateCustomer
}