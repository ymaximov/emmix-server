const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class DeliveryItem extends Model {
        static associate(models) {
            // Define associations here
            DeliveryItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            DeliveryItem.belongsTo(models.sales_orders, { foreignKey: 'so_id' });
            DeliveryItem.belongsTo(models.deliveries, { foreignKey: 'delivery_id' });
            DeliveryItem.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });
        }
    }

    DeliveryItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            tenant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tenants', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            so_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sales_orders', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            delivery_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'deliveries',
                    key: 'id',
                },
            },
            inv_item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'inventory_items', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            so_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            delivered_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            remaining_quantity: {
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
        },
        {
            sequelize,
            modelName: 'delivery_items',
        }
    );

    return DeliveryItem;
};
