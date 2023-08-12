'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new columns to the inventory_items table
    await queryInterface.addColumn('inventory_items', 'cost', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('inventory_items', 'price', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },


  down: async (queryInterface, Sequelize) => {
    // Remove the new columns from the inventory_items table
    await queryInterface.removeColumn('inventory_items', 'cost');
    await queryInterface.removeColumn('inventory_items', 'price');
  },
};
