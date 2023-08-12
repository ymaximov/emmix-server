'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tenant_id: {
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      vendor_id: {
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      warehouse_id: {
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM([
          'open',
          'closed',
          'invoiced',
          'void',
        ]),
        defaultValue: 'open'
      },
      sales_tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_orders');
  },
};
