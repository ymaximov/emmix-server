module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the sales_tax column
    await queryInterface.removeColumn('inventory_items', 'sales_tax');

    // Re-add the sales_tax column as BOOLEAN
    await queryInterface.addColumn('inventory_items', 'sales_tax', {
      type: Sequelize.BOOLEAN,
      allowNull: false, // adjust as needed
      defaultValue: false, // adjust as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the sales_tax column again
    await queryInterface.removeColumn('inventory_items', 'sales_tax');

    // Re-add the sales_tax column as ENUM (if needed)
    await queryInterface.addColumn('inventory_items', 'sales_tax', {
      type: Sequelize.ENUM('liable', 'exempt'), // Change to your original ENUM values
      allowNull: false, // adjust as needed
      defaultValue: 'liable', // adjust as needed
    });
  },
};
