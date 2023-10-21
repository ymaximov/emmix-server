'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('repair_order_activities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tenants',
          key: 'id',
        },
        allowNull: false,
      },
      ro_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'repair_orders',
          key: 'id',
        },
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.TEXT,
      },
      duration: {
        type: Sequelize.STRING,
      },
      meeting_location: {
        type: Sequelize.ENUM('customer site', 'repair lab'),
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'open',
      },
      technician_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          allowNull: true,
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('repair_order_activities');
  },
};

