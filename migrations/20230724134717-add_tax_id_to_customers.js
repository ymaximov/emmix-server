'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customers', 'tax_id', {
      type: Sequelize.STRING, // Replace this with the appropriate data type
      allowNull: true, // Modify this as per your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'tax_id');
  },
};