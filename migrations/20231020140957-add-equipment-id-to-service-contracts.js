'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('service_contracts', 'equipment_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'equipment_cards',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Adjust the deletion rule as needed
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('service_contracts', 'equipment_id');
  },
};
