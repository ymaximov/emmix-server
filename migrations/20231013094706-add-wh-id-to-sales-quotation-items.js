module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the wh_id column
    await queryInterface.addColumn('sales_order_items', 'wh_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses', // Name of the referenced table
        key: 'id',           // Name of the referenced column in the warehouses table
      },
      onUpdate: 'CASCADE',  // Define the ON UPDATE action (if needed)
      onDelete: 'SET NULL', // Define the ON DELETE action (SET NULL in this case)
    });

    await queryInterface.addColumn('sales_quotation_items', 'wh_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses', // Name of the referenced table
        key: 'id',           // Name of the referenced column in the warehouses table
      },
      onUpdate: 'CASCADE',  // Define the ON UPDATE action (if needed)
      onDelete: 'SET NULL', // Define the ON DELETE action (SET NULL in this case)
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the wh_id column
    await queryInterface.removeColumn('sales_order_items', 'wh_id');
  },
};
