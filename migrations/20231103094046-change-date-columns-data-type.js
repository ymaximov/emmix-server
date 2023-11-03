'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('repair_order_activities', 'start_date', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('repair_order_activities', 'end_date', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // You can define the "down" migration to change the data type back to DATE if needed.
    // For example:
    return Promise.all([
      queryInterface.changeColumn('repair_order_activities', 'start_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.changeColumn('repair_order_activities', 'end_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  }
};
