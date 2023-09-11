const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class PurchaseOrder extends Model {
        static associate(models) {
            // Define associations here
            PurchaseOrder.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            PurchaseOrder.belongsTo(models.vendors, { foreignKey: 'vendor_id' });
            PurchaseOrder.belongsTo(models.users, { foreignKey: 'user_id' });
            PurchaseOrder.belongsTo(models.warehouses, { foreignKey: 'warehouse_id' });
            PurchaseOrder.hasMany(models.purchase_order_items, { foreignKey: 'po_id' });
        }
    }

    PurchaseOrder.init(
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
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouses', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'invoiced', 'void'),
                defaultValue: 'open',
            },
            sales_tax: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_amount: {
                type: DataTypes.FLOAT,
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
            modelName: 'purchase_orders',
        }
    );

    return PurchaseOrder;
};
