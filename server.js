require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json())

app.use('/api/admin', require('./routes/admin'))
app.use('/api/user', require('./routes/user'))
app.use('/api/crm', require('./routes/crm'))
app.use('/api/vendor', require('./routes/vendor'))
app.use('/api/purchasing', require('./routes/purchasing'))
app.use('/api/inventory', require('./routes/inventory'))
app.use('/api/sales', require('./routes/sales'))
app.use('/api/service', require('./routes/service'))

sequelize.sync().then(result => {
    const {SERVER_PORT = 8080} = process.env;
    app.listen(SERVER_PORT, () => {
        console.log(`Server and Sequelize started on PORT ${SERVER_PORT}`);
    });
}).catch(err => {
    console.log(err, 'SQL CONNECTION ERROR');
});