'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('delivery_items', 'remaining_quantity', {
      type: Sequelize.INTEGER, // Change the data type if it's not an integer
      allowNull: true, // Allow null values
    });
  },

  down: (queryInterface, Sequelize) => {
    // If you need to revert the change, specify the reverse migration here
  },
};
