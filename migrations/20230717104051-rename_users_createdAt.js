'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
  }
};
