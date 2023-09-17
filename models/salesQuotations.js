const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class SalesQuotation extends Model {
        static associate(models) {
            // Define associations here
            SalesQuotation.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            SalesQuotation.belongsTo(models.customers, { foreignKey: 'customer_id' });
            SalesQuotation.belongsTo(models.users, { foreignKey: 'user_id' });
            SalesQuotation.hasMany(models.sales_quotation_items, { foreignKey: 'sq_id' });
        }
    }

    SalesQuotation.init(
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
                allowNull: false,
            },
            posting_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'void'),
                defaultValue: 'open',
            },
            sales_tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            subtotal: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_amount: {
                type: DataTypes.FLOAT,
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
            modelName: 'sales_quotations',
        }
    );

    return SalesQuotation;
};
