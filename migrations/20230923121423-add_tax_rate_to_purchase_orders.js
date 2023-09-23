'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchase_orders', 'tax_rate', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false if the column is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchase_orders', 'tax_rate');
  },
};
