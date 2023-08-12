'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Inventory.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
            Inventory.belongsTo(models.inventory_items, { foreignKey: 'item_id' })
            Inventory.belongsTo(models.warehouses, { foreignKey: 'warehouse_id' })
        }
    }
    Inventory.init({
        tenant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tenants',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        item_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'inventory_items',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'warehouses',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        modelName: 'inventories',
    });
    return Inventory;
};