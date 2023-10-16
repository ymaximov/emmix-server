'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchase_order_items', 'received_qty', {
      type: Sequelize.INTEGER, // Change the data type to match your needs (e.g., NUMERIC)
      allowNull: true,       // To allow NULL values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchase_order_items', 'received_qty');
  },
};
