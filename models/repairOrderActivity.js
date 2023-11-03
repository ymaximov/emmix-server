'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RepairOrderActivity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            RepairOrderActivity.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
            RepairOrderActivity.belongsTo(models.users, { foreignKey: 'technician_id' })
            RepairOrderActivity.belongsTo(models.repair_orders, { foreignKey: 'ro_id' })
        }
    }
    RepairOrderActivity.init({
        tenant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tenants',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        ro_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'repair_orders',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        technician_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        end_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('open', 'closed'),
            defaultValue: 'open',
        },
        meeting_location: {
            type: Sequelize.ENUM('customer site', 'repair lab', 'phone call'),
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

    }, {
        sequelize,
        modelName: 'repair_order_activities',
    });
    return RepairOrderActivity;
};