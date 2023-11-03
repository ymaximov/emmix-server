'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add columns 'start_date', 'end_date', 'start_time', and 'end_time' to the 'repair_order_activities' table
    return Promise.all([
      queryInterface.addColumn('repair_order_activities', 'start_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
      queryInterface.addColumn('repair_order_activities', 'end_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
      queryInterface.addColumn('repair_order_activities', 'start_time', {
        type: Sequelize.TIME,
        allowNull: true,
      }),
      queryInterface.addColumn('repair_order_activities', 'end_time', {
        type: Sequelize.TIME,
        allowNull: true,
      }),
      queryInterface.changeColumn('repair_order_activities', 'meeting_location', {
        type: Sequelize.ENUM('repair lab', 'customer site', 'phone call'),
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // Remove the added columns and restore the 'meeting_location' column to VARCHAR
    return Promise.all([
      queryInterface.removeColumn('repair_order_activities', 'start_date'),
      queryInterface.removeColumn('repair_order_activities', 'end_date'),
      queryInterface.removeColumn('repair_order_activities', 'start_time'),
      queryInterface.removeColumn('repair_order_activities', 'end_time'),
      queryInterface.changeColumn('repair_order_activities', 'meeting_location', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  }
};
