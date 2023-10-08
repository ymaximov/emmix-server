'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update sales_tax, subtotal, and total_amount columns
    await queryInterface.sequelize.query(`
      ALTER TABLE "purchase_orders" ALTER COLUMN "sales_tax" TYPE DECIMAL(10, 2),
      ALTER COLUMN "subtotal" TYPE DECIMAL(10, 2),
      ALTER COLUMN "total_amount" TYPE DECIMAL(10, 2);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Define a rollback if needed
  },
};
