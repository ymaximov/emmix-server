'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('inventory_items');
  },

  down: (queryInterface, Sequelize) => {
    // This is a destructive action, so you need to decide what to do in the down function.
    // You might recreate the table or restore it from a backup.
    // For demonstration purposes, this is just an example:
    return queryInterface.createTable('inventory_items', {
      // ... define columns and constraints ...
    });
  },
};
