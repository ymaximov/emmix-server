const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Delivery extends Model {
        static associate(models) {
            // Define associations here
            Delivery.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            Delivery.belongsTo(models.customers, { foreignKey: 'customer_id' });
            Delivery.belongsTo(models.users, { foreignKey: 'picker_id' });
            Delivery.belongsTo(models.sales_orders, { foreignKey: 'so_id' });
            Delivery.hasMany(models.delivery_items, { foreignKey: 'delivery_id' });
        }
    }

    Delivery.init(
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
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers', // Replace with the actual table name if different
                    key: 'id',
                },
            },

            picker_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            posting_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'void'),
                defaultValue: 'open',
            },

            invoiced: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
            modelName: 'deliveries',
        }
    );

    return Delivery;
};
