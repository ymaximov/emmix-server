'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('repair_orders', 'contact_person', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('repair_orders', 'contact_person');
  }
};
