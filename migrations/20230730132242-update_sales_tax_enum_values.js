'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vendors', 'sales_tax', {
      type: Sequelize.ENUM('liable', 'exempt'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you want to revert the changes, you can define the reverse migration here.
    // For changing enum values, this might involve switching back to the original values.
  },
};
