'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('repair_order_activities', 'start_time', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('repair_order_activities', 'end_time', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // You can define the "down" migration to change the data type back to TIME if needed.
    // For example:
    return Promise.all([
      queryInterface.changeColumn('repair_order_activities', 'start_time', {
        type: Sequelize.TIME,
        allowNull: true,
      }),
      queryInterface.changeColumn('repair_order_activities', 'end_time', {
        type: Sequelize.TIME,
        allowNull: true,
      }),
    ]);
  }
};
