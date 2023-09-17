'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales_quotations', 'tax_rate', {
      type: Sequelize.INTEGER,
      allowNull: true, // You can change this to false if the column should not allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales_quotations', 'tax_rate');
  },
};
