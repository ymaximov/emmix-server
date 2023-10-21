'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update the description column data type for repair_contract_models
    await queryInterface.changeColumn('repair_contract_models', 'description', {
      type: Sequelize.TEXT, // Change the data type to text (text area)
    });

    // Update the description column data type for service_contract_models
    await queryInterface.changeColumn('service_contract_models', 'description', {
      type: Sequelize.TEXT, // Change the data type to text (text area)
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert the change, specify the reverse migration here
  },
};
