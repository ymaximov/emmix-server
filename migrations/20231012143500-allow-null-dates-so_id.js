module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('sales_orders', 'sq_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null values
    });

  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.changeColumn('sales_qorders', 'sq_id', {
      type: Sequelize.DATE,
      allowNull: false, // Change it back to disallow null values
    });

  },
};
