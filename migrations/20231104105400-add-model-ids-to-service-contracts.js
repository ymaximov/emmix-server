'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'repair_model_id' column to the 'service_contracts' table
    await queryInterface.addColumn('service_contracts', 'repair_model_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'repair_contract_models', // Assuming the table name is 'repair_contract_models'
        key: 'id',
      },
    });

    // Add the 'service_model_id' column to the 'service_contracts' table
    await queryInterface.addColumn('service_contracts', 'service_model_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'service_contract_models', // Assuming the table name is 'service_contract_models'
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'repair_model_id' column from the 'service_contracts' table
    await queryInterface.removeColumn('service_contracts', 'repair_model_id');

    // Remove the 'service_model_id' column from the 'service_contracts' table
    await queryInterface.removeColumn('service_contracts', 'service_model_id');
  },
};
