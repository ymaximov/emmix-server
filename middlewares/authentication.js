const jwt = require('jsonwebtoken');
const httpErrors = require('http-errors')

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token.trim().replace('Bearer ', ''), process.env.JWT_ACCESS_SECRET);
        req.email = decodedToken.email;
        req.id = decodedToken.id;
        req.role = decodedToken.role;
        next()
    } catch (error) {
        next(new httpErrors.Unauthorized('Session expired, please login again'))
    }
};

const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_ACCESS_SECRET);
        if(decodedToken.role !== 'admin'){
            throw new httpErrors.Unauthorized('You do not have permission to perform this operation.')
        }
        next()
    } catch(error){
        const msg =
            error.message !== 'You do not have permission to perform this operation.'
                ? 'Session expired, please login again'
                : error.message;
        next(new httpErrors.Unauthorized(msg));
    }
};

const isRefreshToken = (req, res, next) => {
    try {
        const { token } = req.body;

        const decodedToken = jwt.verify(token, process.env.JWT_REFERESH_SECRET);

        const { name, email, role, user_id } = decodedToken;
        req.name = name;
        req.email = email;
        req.user_id = user_id;
        req.role = role;
        next();
    } catch (error) {

        console.log(error.message);
        next(new httpErrors.Unauthorized('Session expired, please login again'));
    }
};


module.exports = {
    auth,
    isAdmin,
    isRefreshToken,
    isRefreshToken
};
