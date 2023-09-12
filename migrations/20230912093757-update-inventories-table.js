'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the 'quantity' column to 'ordered'
    await queryInterface.renameColumn('inventories', 'quantity', 'ordered');

    // Add new columns 'in_stock', 'committed', and 'available'
    await queryInterface.addColumn('inventories', 'in_stock', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('inventories', 'committed', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('inventories', 'available', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes made in the 'up' method
    await queryInterface.renameColumn('inventories', 'ordered', 'quantity');
    await queryInterface.removeColumn('inventories', 'in_stock');
    await queryInterface.removeColumn('inventories', 'committed');
    await queryInterface.removeColumn('inventories', 'available');
  },
};
