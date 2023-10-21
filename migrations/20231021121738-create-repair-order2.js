'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('repair_orders', {
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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      technician_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
      equipment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'equipment_cards',
          key: 'id',
        },
        allowNull: false,
      },
      contract_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'service_contracts',
          key: 'id',
        },
        allowNull: true,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'on hold', 'cancelled'),
        defaultValue: 'open',
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'low',
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      response_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
      resolution_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
      response_on: {
        type: Sequelize.DATE,
        allowNull: true
      },
      resolution_on: {
        type: Sequelize.DATE,
        allowNull: true
      },
      closed_on: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phone_1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_person: {
        type: Sequelize.STRING,
        allowNull: true
      },
      repair_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resolution_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      scheduled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('repair_orders');
  },
};
