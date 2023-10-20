'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('equipment_card', {
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
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      mfr_serial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      serial_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventory_items',
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
        type: Sequelize.ENUM('active', 'terminated', 'loaned', 'in repair lab'),
        allowNull: false,
        defaultValue: 'active'
      },
      technician: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deliveries',
          key: 'id',
        },
        allowNull: true,
      },
      termination_date: {
        allowNull: true,
        type: Sequelize.DATE,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('equipment_card');
  },
};
