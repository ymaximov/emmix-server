'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('sales_quotation_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });
    await queryInterface.changeColumn('sales_order_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });

    await queryInterface.changeColumn('sales_quotation_items', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });
    await queryInterface.changeColumn('sales_order_items', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false, // Modify this based on your requirements
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE "sales_orders" ALTER COLUMN "sales_tax" TYPE DECIMAL(10, 2),
      ALTER COLUMN "subtotal" TYPE DECIMAL(10, 2),
      ALTER COLUMN "total_amount" TYPE DECIMAL(10, 2);
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "sales_quotations" ALTER COLUMN "sales_tax" TYPE DECIMAL(10, 2),
      ALTER COLUMN "subtotal" TYPE DECIMAL(10, 2),
      ALTER COLUMN "total_amount" TYPE DECIMAL(10, 2);
    `);
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('purchase_order_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modify this based on your requirements
    });


    await queryInterface.changeColumn('purchase_order_items', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modify this based on your requirements
    });
  },
};
