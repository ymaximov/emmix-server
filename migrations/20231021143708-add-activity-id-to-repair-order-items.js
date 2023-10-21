'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('repair_order_items', 'activity_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'repair_order_activities', // Name of the target table
        key: 'id', // The name of the column to reference in the target table

      },
      onUpdate: 'CASCADE', // Optional: Define the reference options as needed
      onDelete: 'CASCADE', // Optional: Define the reference options as needed
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('repair_order_items', 'activity_id');
  },
};
