'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales_order_items', 'delivered_qty', {
      type: Sequelize.INTEGER, // Adjust the data type if needed
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales_order_items', 'delivered_qty');
  }
};
