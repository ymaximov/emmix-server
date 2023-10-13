'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SalesOrderItem extends Model {
        static associate(models) {
            SalesOrderItem.belongsTo(models.sales_orders, { foreignKey: 'so_id' });
            SalesOrderItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            SalesOrderItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            SalesOrderItem.belongsTo(models.warehouses, { foreignKey: 'wh_id' });
            SalesOrderItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id'});
        }
    }

    SalesOrderItem.init(
        {
            tenant_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'tenants',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            so_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sales_orders',
                    key: 'id',
                },
            },
            wh_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
            },
            inv_item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'inventory_items',
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'void'),
                defaultValue: 'open',
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            delivered_qty: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'sales_order_items',
        }
    );

    return SalesOrderItem;
};
