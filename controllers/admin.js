const bcrypt = require('bcryptjs');
const OAuthClient = require('intuit-oauth');
const axios = require('axios');
const models = require('../models')
const fs = require('fs');
const path = require('path');
const { oauthClient } = require('../providers/intuitOauthClient');

//const getIntuitAPIUrl = realmId => `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}`

const createAuthorizeUrl = async (req, res) => {
    const authorizeURL = oauthClient.authorizeUri({
        scope: process.env.REACT_APP_SCOPES.split(' '),
        state: 'testState',
    });
    return res.send(authorizeURL);
}

const authenticateQuickbooksUser = async (req, res, next) => {
    const getUserInfo = () => {
        return oauthClient
            .makeApiCall({
                url:
                    oauthClient.environment === 'sandbox'
                        ? OAuthClient.userinfo_endpoint_sandbox
                        : OAuthClient.userinfo_endpoint_production,
                method: 'GET',
            })
            .then((userInfo) => {
                return {userInfo: userInfo.getJson()};
            });
    };

    const getCompanyInfo = userInfo => {
        const companyID = oauthClient.getToken().realmId;

        const url =
            oauthClient.environment === 'sandbox'
                ? OAuthClient.environment.sandbox
                : OAuthClient.environment.production;

        return oauthClient
            .makeApiCall({url: `${url}v3/company/${companyID}/companyinfo/${companyID}`})
            .then((companyInfo) => {
                return Object.assign({companyInfo: companyInfo.getJson()}, userInfo);
            })
            .catch(function (e) {
                console.error(e);
            });
    };

    oauthClient
        .createToken(req.body.url)
        .then(getUserInfo)
        .then(getCompanyInfo)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch(function (e) {
            console.error(e.intuit_tid);
        });
}

const getInvoices = async (req, res, next) => {
    const access_token = oauthClient.token.getToken();
    const companyID = oauthClient.getToken().realmId;

    const query = 'select * from Invoice';

    //const sandboxInvoiceUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyID}/invoice?minorversion=70`
    //const invoiceUrl = `https://quickbooks.api.intuit.com/v3/company/${companyID}/invoice?minorversion=70`;
    const queryCallURI = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyID}/query?query=${encodeURIComponent(query)}`;

    try {
        const result = await axios.get(queryCallURI, {
            headers: {
                'Authorization': 'Bearer ' + access_token.access_token,
            }
        })

        const {data} = result;
        res.status(200).json({data});
    } catch (e) {
        res.status(500).json({message: 'Error: Cannot get invoices'});
    }
}

const getInvoicePDF = async (req, res, next) => {
    const access_token = oauthClient.token.getToken();
    const companyID = oauthClient.getToken().realmId;
    const pdfFilePath = `Invoice_${req.params.invoiceId}.pdf`;

    const queryCallURI = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyID}/invoice/${req.params.invoiceId}/pdf?minorversion=70`;
    try {
        const response = await axios({
            method: 'get',
            url: queryCallURI,
            responseType: 'stream',
            headers: {
                'Authorization': `Bearer ${access_token.access_token}`,
            }
        });

        const writer = fs.createWriteStream(pdfFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`PDF file has been downloaded and saved as ${pdfFilePath}`);

        res.sendFile(path.resolve(pdfFilePath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({message: 'Error sending PDF file.'});
            }
        });
    } catch (e) {
        res.status(500).json({message: 'Error: Cannot get PDF'});
    }
}

const createInvoice = async (req, res) => {
    const access_token = oauthClient.token.getToken();
    const companyID = oauthClient.getToken().realmId;

    if (!companyID) return res.json({
        error: 'No realm ID. QBO calls only work if the accounting scope was passed!'
    })

    const { totalAmount } = req.body;
    const queryCallURI = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyID}/invoice?minorversion=40`;

    const requestBody = {
        'Line': [
            {
                "DetailType": "SalesItemLineDetail",
                "Amount": Number(totalAmount),
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Concrete",
                        "value": "3"
                    }
                }
            }
        ],
        'CustomerRef': {
            'value': 2
        },
        "CustomField": [
            {
                "DefinitionId": "1",
                "Name": "Wood Type",
                "Type": "StringType",
                "StringValue": "Oak"
            }
        ]
    };

    try {
        const response = await axios({
            method: 'post',
            url: queryCallURI,
            data: requestBody,
            headers: {
                'Authorization': `Bearer ${access_token.access_token}`,
            }
        });

        res.status(200)
            .send({message: 'Invoice has been successfully added', data: response.data});
    } catch (e) {
        res.status(500).json({message: 'Could not create invoice'});
    }

}
const createTenant = async (req, res, next) => {
    try {
        const {
            company_name,
            email,
            first_name,
            last_name,
            phone,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            security_code
        } = req.body;

        // Create a new user
        const tenant = await models.tenants.create({
            company_name,
            email,
            first_name,
            last_name,
            phone,
            address_1,
            address_2,
            city,
            state,
            postal_code,
            country,
            security_code
        });

        res.status(200)
            .send({message: 'Company has been successfully added'})
    } catch (error) {
        console.error('Error inserting tenant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllTenants = async (req, res, next) => {
    try {
        const tenants = await models.tenants.findAll();
        res.status(200).json(tenants);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const updateTenant = async (req, res, next) => {
    const tenantId = req.params.id;
    const dataToUpdate = req.body;
    try {
        const tenant = await models.tenants.findByPk(tenantId);

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        // Update the item with the new data
        const updatedTenant = await tenant.update(dataToUpdate);

        res.send({message: 'Tenant details have been updated', data: updatedTenant})
    } catch (error) {
        res.status(500).json({message: 'Error updating tenant'});
        console.log(error)
    }
}

const getUserAccountsByTenant = async (req, res, next) => {
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
        res.status(200).send({message: 'User accounts have been fetched successfully', data: users});
    } catch (error) {
        res.status(500).json({message: 'Error fetching tenants'});
        console.log(error)
    }
}

const resetPassword = async (req, res, next) => {
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


        if (!user) {
            console.log('there is no user')
            return res.status(403).send({message: 'User does not exist', success: false})
        } else if (!isPasswordMatch) {
            console.log('passwords dont match')
            return res.status(409).send({message: 'Passwords do not match', success: false})
        } else {
            console.log('trying to update password')
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updatedPassword = await user.update({
                password: hashedPassword
            });
            console.log('updated password', updatedPassword)
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
    resetPassword,
    createAuthorizeUrl,
    authenticateQuickbooksUser,
    getInvoices,
    getInvoicePDF,
    createInvoice,
}
