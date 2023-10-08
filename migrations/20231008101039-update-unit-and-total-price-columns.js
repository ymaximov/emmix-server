'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('purchase_order_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });

    await queryInterface.changeColumn('purchase_order_items', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('purchase_order_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modify this based on your requirements
    });

    await queryInterface.changeColumn('purchase_order_items', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modify this based on your requirements
    });
  },
};
