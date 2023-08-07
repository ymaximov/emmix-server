'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    // Change column name manufacturer to manufacturer_id
    await queryInterface.renameColumn('inventory_items', 'manufacturer', 'manufacturer_id');

    // Change column name item_group to item_group_id
    await queryInterface.renameColumn('inventory_items', 'item_group', 'item_group_id');
  },

  down: (queryInterface, Sequelize) => {
    // Revert the column name changes
    queryInterface.renameColumn('inventory_items', 'manufacturer_id', 'manufacturer');
    queryInterface.renameColumn('inventory_items', 'item_group_id', 'item_group');
  },
};
