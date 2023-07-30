'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vendors', 'pcontact_phone', 'contact_phone');
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert the change, you can do so with the down function:
    await queryInterface.renameColumn('vendors', 'contact_phone', 'pcontact_phone');
  },
};
