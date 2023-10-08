'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class APInvoiceItem extends Model {
        static associate(models) {
            APInvoiceItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            APInvoiceItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            APInvoiceItem.belongsTo(models.ap_invoices, { foreignKey: 'ap_inv_id'});
        }
    }

    APInvoiceItem.init(
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
            ap_inv_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'ap_invoices',
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
        },
        {
            sequelize,
            modelName: 'ap_invoice_items',
        }
    );

    return APInvoiceItem;
};
