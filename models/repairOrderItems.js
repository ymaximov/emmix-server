'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RepairOrderItems extends Model {
        static associate(models) {
            RepairOrderItems.belongsTo(models.repair_orders, { foreignKey: 'ro_id' });
            RepairOrderItems.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            RepairOrderItems.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            RepairOrderItems.belongsTo(models.warehouses, { foreignKey: 'wh_id' });
            RepairOrderItems.belongsTo(models.repair_order_activities, { foreignKey: 'activity_id' });
        }
    }

    RepairOrderItems.init(
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
            ro_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'repair_orders',
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
            technician_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            activity_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'repair_order_activities',
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
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'repair_order_items',
        }
    );

    return RepairOrderItems;
};
