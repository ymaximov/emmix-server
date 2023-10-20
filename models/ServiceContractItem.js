'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ServiceContractItem extends Model {
        static associate(models) {
            ServiceContractItem.belongsTo(models.service_contracts, { foreignKey: 'sc_id' });
            ServiceContractItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            ServiceContractItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            ServiceContractItem.belongsTo(models.users, { foreignKey: 'user_id' });
        }
    }

    ServiceContractItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            tenant_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'tenants',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            sc_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'service_contracts',
                    key: 'id',
                },
            },
            inv_item_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'inventory_items',
                    key: 'id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'service_contract_items',
        }
    );

    return ServiceContractItem;
};
