'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('repair_orders', 'contract_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'service_contracts', // The table it references
        key: 'id', // The primary key in the referenced table
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    // If you need to revert the change, specify the reverse migration here
    return queryInterface.changeColumn('repair_orders', 'contract_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'service_contracts',
        key: 'id',
      },
    });
  },
};
