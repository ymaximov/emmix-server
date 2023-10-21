'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('repair_orders', 'contract_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'service_contracts',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('repair_orders', 'contract_id');
  },
};
