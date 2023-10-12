'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SalesQuotationItem extends Model {
        static associate(models) {
            SalesQuotationItem.belongsTo(models.sales_quotations, { foreignKey: 'sq_id' });
            SalesQuotationItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
            SalesQuotationItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            SalesQuotationItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id'});
        }
    }

    SalesQuotationItem.init(
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
            sq_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sales_quotations',
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
            modelName: 'sales_quotation_items',
        }
    );

    return SalesQuotationItem;
};
