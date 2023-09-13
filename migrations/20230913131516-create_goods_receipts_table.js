'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods_receipts', {
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
      vendor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vendors',
          key: 'id',
        },
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        allowNull: false,
      },
      po_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'purchase_orders',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
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
    await queryInterface.dropTable('goods_receipts');
  },
};
