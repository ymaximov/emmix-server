const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class SalesOrder extends Model {
        static associate(models) {
            // Define associations here
            SalesOrder.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            SalesOrder.belongsTo(models.customers, { foreignKey: 'customer_id' });
            SalesOrder.belongsTo(models.users, { foreignKey: 'user_id' });
            SalesOrder.hasMany(models.sales_order_items, { foreignKey: 'so_id' });
            SalesOrder.hasMany(models.so_items, { foreignKey: 'so_id' });
        }
    }

    SalesOrder.init(
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
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            sq_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'sales_quotations',
                    key: 'id',
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            posting_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'void'),
                defaultValue: 'open',
            },
            sales_tax: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            invoiced: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            reference: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tax_rate: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            modelName: 'sales_orders',
        }
    );

    return SalesOrder;
};
