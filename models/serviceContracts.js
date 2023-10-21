const { Model, Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class ServiceContract extends Model {
        static associate(models) {
            // Define associations here
            ServiceContract.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            ServiceContract.belongsTo(models.customers, { foreignKey: 'customer_id' });
            ServiceContract.belongsTo(models.users, { foreignKey: 'user_id' });
            ServiceContract.belongsTo(models.equipment_cards, { foreignKey: 'equipment_id' });
            ServiceContract.hasMany(models.service_contract_items, { foreignKey: 'sc_id' });
        }
    }

    ServiceContract.init(
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
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'equipment_cards', // Replace with the actual table name if different
                    key: 'id',
                },
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('approved', 'on hold', 'terminated', 'draft'),
                defaultValue: 'draft',
            },
            renewal: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            service_type: {
                type: DataTypes.ENUM('regular', 'warranty'),
                defaultValue: 'regular',
            },
            contract_type: {
                type: DataTypes.ENUM('service', 'repair'),
                defaultValue: 'service',
            },
            response_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            response_time_type: {
                type: DataTypes.ENUM('hours', 'days'),
                defaultValue: 'hours',
            },
            resolution_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            resolution_time_type: {
                type: DataTypes.ENUM('hours', 'days'),
                defaultValue: 'hours',
            },
            monday: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            tuesday: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            wednesday: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            thursday: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            friday: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            saturday: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            sunday: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            holidays: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            parts: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            labor: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            travel: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            modelName: 'service_contracts',
        }
    );

    return ServiceContract;
};
