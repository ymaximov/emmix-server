module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('sales_orders', 'posting_date', {
      type: Sequelize.DATE,
      allowNull: true, // Allow null values
    });

    await queryInterface.changeColumn('sales_orders', 'due_date', {
      type: Sequelize.DATE,
      allowNull: true, // Allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.changeColumn('sales_orders', 'posting_date', {
      type: Sequelize.DATE,
      allowNull: false, // Change it back to disallow null values
    });

    await queryInterface.changeColumn('sales_qorders', 'due_date', {
      type: Sequelize.DATE,
      allowNull: false, // Change it back to disallow null values
    });
  },
};
