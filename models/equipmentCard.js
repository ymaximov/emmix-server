const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class EquipmentCard extends Model {
        static associate(models) {
            // Define associations here
            EquipmentCard.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            EquipmentCard.belongsTo(models.customers, { foreignKey: 'customer_id' });
            EquipmentCard.belongsTo(models.users, { foreignKey: 'user_id' });
            EquipmentCard.belongsTo(models.users, { foreignKey: 'technician' });
            EquipmentCard.belongsTo(models.inventory_items, { foreignKey: 'inv_item_id' });

        }
    }

    EquipmentCard.init(
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
            mfr_serial: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            serial_no: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            inv_item_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'inventory_items',
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
            technician_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },

            status: {
                type: DataTypes.ENUM('active', 'terminated', 'loaned', 'in repair lab'),
                defaultValue: 'active',
            },

            delivery_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'deliveries',
                    key: 'id',
                },
            },
            termination_date: {
                allowNull: true,
                type: DataTypes.DATE,
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
            modelName: 'equipment_cards',
        }
    );

    return EquipmentCard;
};
