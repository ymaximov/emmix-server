'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.renameColumn('item_properties', 'ID', 'id');
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.renameColumn('item_properties', 'id', 'ID');
  },
};
