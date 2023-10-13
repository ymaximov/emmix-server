'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('sales_order_items', 'status', {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: true,
        defaultValue: 'open',
      }),

    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sales_order_items', 'status')
    ]);
  },
};
