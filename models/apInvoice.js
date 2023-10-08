const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class APInvoice extends Model {
        static associate(models) {
            // Define associations here
            APInvoice.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            APInvoice.belongsTo(models.vendors, { foreignKey: 'vendor_id' });
            APInvoice.belongsTo(models.users, { foreignKey: 'user_id' });
            APInvoice.belongsTo(models.users, { foreignKey: 'buyer_id' });
            APInvoice.belongsTo(models.purchase_orders, { foreignKey: 'po_id' });
            APInvoice.hasMany(models.ap_invoice_items, { foreignKey: 'ap_inv_id' });
        }
    }

    APInvoice.init(
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
            vendor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'vendors', // Replace with the actual table name if different
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
            buyer_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },

            po_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'purchase_orders', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'void'),
                defaultValue: 'open',
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
            modelName: 'ap_invoices',
        }
    );

    return APInvoice;
};
