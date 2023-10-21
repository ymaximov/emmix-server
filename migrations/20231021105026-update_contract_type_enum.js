'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('service_contracts', 'contract_type', {
      type: Sequelize.ENUM('service', 'repair'), // Change the enum values
      allowNull: false, // Modify the allowNull constraint as needed
    });
  },

  down: (queryInterface, Sequelize) => {
    // If you need to revert the change, specify the reverse migration here
    return queryInterface.changeColumn('service_contracts', 'contract_type', {
      type: Sequelize.ENUM('service', 'repair'), // Change it back to the original enum values
      allowNull: false, // Modify the allowNull constraint as needed
    });
  },
};
