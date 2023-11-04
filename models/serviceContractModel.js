'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ServiceContractModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ServiceContractModel.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
            ServiceContractModel.belongsTo(models.users, { foreignKey: 'user_id' })
        }
    }
    ServiceContractModel.init({
        tenant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tenants',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },

        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('NOW()'),
        },

    }, {
        sequelize,
        modelName: 'service_contract_models',
    });
    return ServiceContractModel;
};