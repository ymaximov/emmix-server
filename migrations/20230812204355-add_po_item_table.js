'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_order_items', {
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
      po_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'purchase_orders',
          key: 'id',
        },
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inventory_items',
          key: 'id',
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_price: {
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
    await queryInterface.dropTable('purchase_order_items');
  },
};
