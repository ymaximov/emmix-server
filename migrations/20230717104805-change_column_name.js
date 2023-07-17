'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('tenants', 'created_at', 'createdAt');
    await queryInterface.renameColumn('tenants', 'updated_at', 'updatedAt');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('tenants', 'createdAt', 'created_at');
    await queryInterface.renameColumn('tenants', 'updatedAt', 'updated_at');
  }
};
