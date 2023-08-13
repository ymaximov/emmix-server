'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'subtotal' column to 'purchase_orders' table
    await queryInterface.addColumn('purchase_orders', 'subtotal', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'subtotal' column from 'purchase_orders' table
    await queryInterface.removeColumn('purchase_orders', 'subtotal');
  },
};
