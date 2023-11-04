'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('price_entries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
        tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tenants', // Assuming the table name is 'price_lists'
          key: 'id',
        },
      },
      price_list_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'price_lists', // Assuming the table name is 'price_lists'
          key: 'id',
        },
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'inventory_items', // Assuming the table name is 'inventory_items'
          key: 'id',
        },
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.dropTable('price_entries');
  },
};
