const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class RepairOrder extends Model {
        static associate(models) {
            // Define associations here
            RepairOrder.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            RepairOrder.belongsTo(models.customers, { foreignKey: 'customer_id' });
            RepairOrder.belongsTo(models.users, { foreignKey: 'user_id' });
            RepairOrder.belongsTo(models.users, { foreignKey: 'technician_id' });
            RepairOrder.belongsTo(models.users, { foreignKey: 'response_by' });
            RepairOrder.belongsTo(models.users, { foreignKey: 'resolution_by' });
            RepairOrder.belongsTo(models.equipment_cards, { foreignKey: 'equipment_id' });
            RepairOrder.belongsTo(models.service_contracts, { foreignKey: 'contract_id' });
            RepairOrder.hasMany(models.repair_order_activities, { foreignKey: 'ro_id' });
            RepairOrder.hasMany(models.repair_order_items, { foreignKey: 'ro_id' });
        }
    }

    RepairOrder.init(
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
                allowNull: false,
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
            response_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            resolution_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'equipment_cards',
                    key: 'id',
                },
            },
            contract_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'service_contracts',
                    key: 'id',
                },
            },
            invoiced: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            response_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            resolution_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            closed_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'on hold', 'cancelled'),
                defaultValue: 'open',
            },
            priority: {
                type: DataTypes.ENUM('low', 'medium', 'high'),
                defaultValue: 'low',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            repair_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            resolution_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            contact_person: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone_1: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            mobile_phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tax_rate: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            scheduled: {
                type: DataTypes.BOOLEAN,

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
            modelName: 'repair_orders',
        }
    );

    return RepairOrder;
};
