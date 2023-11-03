'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Remove the 'start_time' and 'end_time' columns from the 'repair_order_activities' table
    return queryInterface.removeColumn('repair_order_activities', 'start_time')
        .then(() => {
          return queryInterface.removeColumn('repair_order_activities', 'end_time');
        });
  },

  down: (queryInterface, Sequelize) => {
    // Restore the 'start_time' and 'end_time' columns to the 'repair_order_activities' table
    return queryInterface.addColumn('repair_order_activities', 'start_time', {
      type: Sequelize.TIME,
      allowNull: true,
    })
        .then(() => {
          return queryInterface.addColumn('repair_order_activities', 'end_time', {
            type: Sequelize.TIME,
            allowNull: true,
          });
        });
  }
};
