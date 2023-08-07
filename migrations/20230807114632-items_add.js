'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('inventory_items', 'manufacturer_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'manufacturers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
      queryInterface.addColumn('inventory_items', 'item_group_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'item_groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
