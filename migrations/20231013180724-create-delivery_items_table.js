'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_items', {
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
      },
      so_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sales_orders',
          key: 'id',
        },
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deliveries',
          key: 'id',
        },
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventory_items',
          key: 'id',
        },
      },
      so_quantity: {
        type: Sequelize.INTEGER,
      },
      delivered_quantity: {
        type: Sequelize.INTEGER,
      },
      remaining_quantity: {
        type: Sequelize.INTEGER,
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('delivery_items');
  },
};
