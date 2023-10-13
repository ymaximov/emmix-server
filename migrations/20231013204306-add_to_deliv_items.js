'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('delivery_items', 'delivered_quantity', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to true if it can be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('delivery_items', 'delivered_quantity');
  }
};
