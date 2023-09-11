'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchase_orders', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // This should be the name of the users table
        key: 'id',
      },
      onUpdate: 'CASCADE', // Optional: Define cascade behavior on update
      onDelete: 'CASCADE', // Optional: Define cascade behavior on delete
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchase_orders', 'user_id');
  },
};
