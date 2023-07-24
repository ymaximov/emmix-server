const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')

const addUser = async(req, res, next) => {
    try {
        const {email, password, first_name, last_name, phone, role, tenant_id} = req.body;
        console.log('***REQUEST BODY****', req.body)
        console.log('***first Name*** B4', first_name)
        const options = {
            where: {
                email
            },
        }

        const user = await models.users.findOne(options)
        if (user){
            return res.status(403).send({message: 'User already exists', success: false})
        } else {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // req.body.password = hashedPassword;

            console.log('***first Name*** AFTER', first_name)
            console.log('***TENANT ID', tenant_id)

            const newUser = await models.users.create({
                tenant_id, first_name, last_name, email, password: hashedPassword, phone, role
            });
            res.status(200).send({message: 'User created successfully', success: true})
        }

    } catch (error) {
        res.status(500).send({message: 'Error creating user', success: false, error});
        console.log('***ERROR***', error)
    }
}
const loginUser = async(req, res, next) => {
    console.log(req.body)
    try {
        const {email, password} = req.body;
        console.log('before options', email)
        const options = {
            where: {
                email
            },
            include: {
                model: models.tenants,
                attributes: ['company_name', 'id'], // Specify the attributes you want to retrieve (e.g., 'name')
            },

        };
        console.log('after options', email)
        const user = await models.users.findOne(options);
        console.log('***user details**',user)

        if(!user) {
            return res.status(404)
                .send({message: 'User Does Not Exist', success: false})
        }


        const isValidUser = await bcrypt.compare(password, user.password);
        console.log(password, user.password)
        console.log('ISVALIDUSER*****', isValidUser)
        // const isValidUser = password === user.password

        if (isValidUser) {
            const access_token = jwt.sign({
                    email: user.email,
                    user_id: user.id,
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                process.env.JWT_SECRET, {
                    expiresIn: '8h',
                    algorithm: 'HS384'
                })
            const refresh_token = jwt.sign({
                email: user.email,
                user_id: user.id,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
            }, process.env.JWT_SECRET, {
                expiresIn: '1d',
                algorithm: 'HS384'
            });

            const access_token_expiry = moment().add(1, 'day').valueOf();
            const refresh_token_expiry = moment().add(2, 'months').valueOf();

            res.status(200).json({
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                tenant_company_name: user.tenant.company_name,
                tenant_id: user.tenant.id,
                access_token,
                access_token_expiry,
                refresh_token,
                refresh_token_expiry
            });
            console.log('user has logged in')
        } else {
            return res.status(401)
            .send({message: 'Password is incorrect', success: false})
        }
        // if(!isValidUser) {
        //     // throw new httpErrors.Unauthorized({message: 'Invalid Password'});
        //     return res.status(401)
        //         .send({message: 'Password is incorrect', success: false})
        // }


    } catch (error){
        next(error)
        console.log('****ERROR***', error)
    }
}

const updateUser = async(req, res, next) => {
    try {
        const {email, password, first_name, last_name, phone, role, tenant_id, account_status} = req.body;
        console.log('***REQUEST BODY****', req.body)
        console.log('***first Name*** B4', first_name)
        const options = {
            where: {
                email
            },
        }
        const user = await models.users.findOne(options)


            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await user.update(req.body);
            res.status(200).send({message: 'User updated successfully', success: true})

    } catch (error) {
        res.status(500).send({message: 'Error updating user', success: false, error});
        console.log('***ERROR***', error)
    }
}

module.exports = {
    addUser,
    loginUser,
    updateUser
}