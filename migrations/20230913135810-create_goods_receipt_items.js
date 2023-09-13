'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods_receipt_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tenants',
          key: 'id',
        },
        allowNull: false,
      },
      goods_receipt_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'goods_receipts',
          key: 'id',
        },
        allowNull: false,
      },
      inv_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventory_items',
          key: 'id',
        },
        allowNull: false,
      },
      po_quantity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      received_quantity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goods_receipt_items');
  },
};
