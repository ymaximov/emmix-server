'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update the data type of the description column to TEXT
    await queryInterface.changeColumn('repair_orders', 'description', {
      type: Sequelize.TEXT,
    });

    // Update the data type of the repair_description column to TEXT
    await queryInterface.changeColumn('repair_orders', 'repair_description', {
      type: Sequelize.TEXT,
    });

    // Update the data type of the resolution_description column to TEXT
    await queryInterface.changeColumn('repair_orders', 'resolution_description', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert the change, specify the reverse migration here
    // Note: Reverting data type changes can be complex and may require manual steps.
  },
};
