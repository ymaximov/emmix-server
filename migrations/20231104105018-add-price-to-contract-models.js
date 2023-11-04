'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'price' column to the 'repair_contract_models' table
    await queryInterface.addColumn('repair_contract_models', 'price', {
      type: Sequelize.DECIMAL(10, 2), // 2 decimal points
      allowNull: true, // Modify this as needed
    });

    // Add the 'price' column to the 'service_contract_models' table
    await queryInterface.addColumn('service_contract_models', 'price', {
      type: Sequelize.DECIMAL(10, 2), // 2 decimal points
      allowNull: true, // Modify this as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'price' column from the 'repair_contract_models' table
    await queryInterface.removeColumn('repair_contract_models', 'price');

    // Remove the 'price' column from the 'service_contract_models' table
    await queryInterface.removeColumn('service_contract_models', 'price');
  },
};
