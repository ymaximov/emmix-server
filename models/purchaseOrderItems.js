'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PurchaseOrderItem extends Model {
        static associate(models) {
            PurchaseOrderItem.belongsTo(models.purchase_orders, { foreignKey: 'po_id' });
            PurchaseOrderItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            PurchaseOrderItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            PurchaseOrderItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id'});
        }
    }

    PurchaseOrderItem.init(
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
            po_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'purchase_orders',
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
                allowNull: false,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'purchase_order_items',
        }
    );

    return PurchaseOrderItem;
};
