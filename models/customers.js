'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
        }
    }
    Customer.init({
        tenant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tenants',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        phone_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fax: {
            type: DataTypes.STRING,
            allowNull: true
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: true
        },
        customer_type: {
            type: DataTypes.ENUM,
            values: ['commercial', 'individual', 'government'],
            defaultValue: 'commercial',
            allowNull: false
        },
        payment_terms: {
            type: DataTypes.STRING,
            allowNull: true
        },
        late_interest: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cc_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cc_expiration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cc_security_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cc_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_account_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bic_swift: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_branch: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_signature_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive', 'deleted'],
            defaultValue: 'active',
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'customers',
    });
    return Customer;
};