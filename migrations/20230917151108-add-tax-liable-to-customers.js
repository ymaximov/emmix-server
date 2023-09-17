'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customers', 'tax_liable', {
      type: Sequelize.BOOLEAN,
      allowNull: false, // Set to false to disallow null values
      defaultValue: true, // Set the default value to true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'tax_liable');
  },
};
