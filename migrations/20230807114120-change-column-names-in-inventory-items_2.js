'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the columns without constraints
    await Promise.all([
      queryInterface.removeColumn('inventory_items', 'manufacturer_id'),
      queryInterface.removeColumn('inventory_items', 'item_group_id'),
    ]);

    // Then, re-add the columns with associations
    await Promise.all([
      queryInterface.addColumn('inventory_items', 'manufacturer_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'manufacturers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
      queryInterface.addColumn('inventory_items', 'item_group_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'item_groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // First, remove the columns with associations
    await Promise.all([
      queryInterface.removeColumn('inventory_items', 'manufacturer_id'),
      queryInterface.removeColumn('inventory_items', 'item_group_id'),
    ]);

    // Then, re-add the columns without constraints
    await Promise.all([
      queryInterface.addColumn('inventory_items', 'manufacturer_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('inventory_items', 'item_group_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },
};
