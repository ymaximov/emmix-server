'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('customers', 'contact_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('customers', 'contact_phone', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });
    await queryInterface.sequelize.query('UPDATE "customers" SET "contact_phone" = "phone_2"');
    await queryInterface.removeColumn('customers', 'phone_2');
    },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'contact_name');
    await queryInterface.addColumn('customers', 'contact_phone', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as per your requirement
    });

    // Step 2: Copy data from the new column to the old one
    await queryInterface.sequelize.query('UPDATE "customers" SET "contact_phone" = "phone_2"');

    // Step 3: Remove the new column
    await queryInterface.removeColumn('customers', 'phone_2');
    // Remove more columns as needed for rollback
  },
};