'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class GoodsReceiptItem extends Model {
        static associate(models) {
            GoodsReceiptItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            GoodsReceiptItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            GoodsReceiptItem.belongsTo(models.goods_receipts, { foreignKey: 'goods_receipt_id'});
        }
    }

    GoodsReceiptItem.init(
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
            goods_receipt_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'goods_receipts',
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
                allowNull: true,
            },
            received_quantity: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },

        },
        {
            sequelize,
            modelName: 'goods_receipt_items',
        }
    );

    return GoodsReceiptItem;
};
