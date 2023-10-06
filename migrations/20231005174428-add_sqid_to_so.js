'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a new column 'sq_id' to the 'sales_orders' table
    await queryInterface.addColumn('sales_orders', 'sq_id', {
      type: Sequelize.INTEGER, // Adjust the data type as needed
      allowNull: true, // This allows the column to be NULL
      references: {
        model: 'sales_quotations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'sq_id' column if needed (rollback)
    await queryInterface.removeColumn('sales_orders', 'sq_id');
  },
};
