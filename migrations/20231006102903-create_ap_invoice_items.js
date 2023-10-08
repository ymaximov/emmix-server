'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ap_invoice_items', {
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
      ap_inv_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ap_invoices',
          key: 'id',
        },
        allowNull: false,
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventory_items',
          key: 'id',
        },
        allowNull: false,
      },
      quantity: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('ap_invoice_items');
  },
};
