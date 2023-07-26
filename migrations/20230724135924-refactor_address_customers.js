'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Remove the existing column
    await queryInterface.removeColumn('customers', 'address_1');

    // Step 2: Add a new column with the desired data type
    await queryInterface.addColumn('customers', 'address_1', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
    await queryInterface.removeColumn('customers', 'address_2');

    // Step 2: Add a new column with the desired data type
    await queryInterface.addColumn('customers', 'address_2', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
    await queryInterface.removeColumn('customers', 'city');

    // Step 2: Add a new column with the desired data type
    await queryInterface.addColumn('customers', 'city', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
    await queryInterface.removeColumn('customers', 'state');

    // Step 2: Add a new column with the desired data type
    await queryInterface.addColumn('customers', 'state', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
    await queryInterface.removeColumn('customers', 'postal_code');

    // Step 2: Add a new column with the desired data type
    await queryInterface.addColumn('customers', 'postal_code', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Step 1: Remove the newly added column
    await queryInterface.removeColumn('customers', 'address_1');

    // Step 2: Add back the existing column with the old data type
    await queryInterface.addColumn('customers', 'address_1', {
      type: Sequelize.DATE,
      allowNull: true, // Modify this as per your requirement
    });
  },
};