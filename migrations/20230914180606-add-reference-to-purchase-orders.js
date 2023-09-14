'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchase_orders', 'reference', {
      type: Sequelize.STRING, // Adjust the data type as needed
      allowNull: true, // Allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchase_orders', 'reference');
  },
};
