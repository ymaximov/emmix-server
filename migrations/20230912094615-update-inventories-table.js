'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the columns
    await queryInterface.removeColumn('inventories', 'ordered');
    await queryInterface.removeColumn('inventories', 'in_stock');
    await queryInterface.removeColumn('inventories', 'committed');
    await queryInterface.removeColumn('inventories', 'available');

    // Add the columns back with allowNull: true
    await queryInterface.addColumn('inventories', 'ordered', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null, // Default value can be null
    });

    await queryInterface.addColumn('inventories', 'in_stock', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null, // Default value can be null
    });

    await queryInterface.addColumn('inventories', 'committed', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null, // Default value can be null
    });

    await queryInterface.addColumn('inventories', 'available', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null, // Default value can be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes made in the 'up' method
    await queryInterface.removeColumn('inventories', 'ordered');
    await queryInterface.removeColumn('inventories', 'in_stock');
    await queryInterface.removeColumn('inventories', 'committed');
    await queryInterface.removeColumn('inventories', 'available');

    // Add back the columns without allowNull
    await queryInterface.addColumn('inventories', 'ordered', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('inventories', 'in_stock', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('inventories', 'committed', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('inventories', 'available', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
