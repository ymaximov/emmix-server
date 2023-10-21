'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('repair_orders');
  },

  down: (queryInterface, Sequelize) => {
    // The "down" migration can be left empty or omitted
  },
};
