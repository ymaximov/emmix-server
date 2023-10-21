'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'technician', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }).then(() => {
      return queryInterface.addColumn('users', 'sales_rep', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }).then(() => {
      return queryInterface.addColumn('users', 'buyer', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    // Remove the new columns if necessary
    return queryInterface.removeColumn('users', 'technician')
        .then(() => {
          return queryInterface.removeColumn('users', 'sales_rep');
        })
        .then(() => {
          return queryInterface.removeColumn('users', 'buyer');
        });
  },
};
