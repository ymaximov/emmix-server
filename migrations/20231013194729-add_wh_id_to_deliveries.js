'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deliveries', 'wh_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // Set to true if it can be null
      references: {
        model: 'warehouses', // Replace with the actual name of the warehouses table
        key: 'id',
      },
      onUpdate: 'CASCADE', // Optional: Define your desired referential actions
      onDelete: 'CASCADE', // Optional: Define your desired referential actions
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deliveries', 'wh_id');
  }
};
