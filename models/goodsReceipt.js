const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class GoodsReceipt extends Model {
        static associate(models) {
            // Define associations here
            GoodsReceipt.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            GoodsReceipt.belongsTo(models.vendors, { foreignKey: 'vendor_id' });
            GoodsReceipt.belongsTo(models.users, { foreignKey: 'receiver_id' });
            GoodsReceipt.belongsTo(models.users, { foreignKey: 'buyer_id' });
            GoodsReceipt.belongsTo(models.warehouses, { foreignKey: 'warehouse_id' });
            GoodsReceipt.belongsTo(models.purchase_orders, { foreignKey: 'po_id' });
            GoodsReceipt.hasMany(models.goods_receipt_items, { foreignKey: 'goods_receipt_id' });
        }
    }

    GoodsReceipt.init(
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
            receiver_id: {
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
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouses', // Replace with the actual table name if different
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
            modelName: 'goods_receipts',
        }
    );

    return GoodsReceipt;
};
