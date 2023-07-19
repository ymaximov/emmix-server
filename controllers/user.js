const httpErrors = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models')

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
                attributes: ['company_name'], // Specify the attributes you want to retrieve (e.g., 'name')
            },

        };
        console.log('after options', email)
        const user = await models.users.findOne(options);
        console.log('***user details**',user)

        if(!user) {
            return res.status(404)
                .send({message: 'User Does Not Exist', success: false})
        }


        // const isValidUser = await bcrypt.compare(password, user.password);
        const isValidUser = password === user.password

        if(!isValidUser) {
            // throw new httpErrors.Unauthorized({message: 'Invalid Password'});
            return res.status(401)
                .send({message: 'Password is incorrect', success: false})
        }

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
            access_token,
            access_token_expiry,
            refresh_token,
            refresh_token_expiry
        });
        console.log('user has logged in')
    } catch (error){
        next(error)
        console.log(error)
    }
}

module.exports = {
    loginUser
}