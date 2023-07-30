'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vendor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Vendor.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
        }
    }
    Vendor.init({
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
        tax_id: {
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
        address_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
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

        contact_phone: {
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
        vendor_type: {
            type: DataTypes.ENUM,
            values: ['commercial', 'individual', 'education', 'government'],
            allowNull: true
        },
        sales_tax: {
            type: DataTypes.ENUM,
            values: ['liable', 'exempt'],
            allowNull: true
        },
        payment_terms: {
            type: DataTypes.STRING,
            allowNull: true
        },
        late_interest: {
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
        modelName: 'vendors',
    });
    return Vendor;
};