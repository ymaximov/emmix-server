'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'order_date' column from 'purchase_orders' table
    await queryInterface.removeColumn('purchase_orders', 'order_date');
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the 'order_date' column to 'purchase_orders' table
    await queryInterface.addColumn('purchase_orders', 'order_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
