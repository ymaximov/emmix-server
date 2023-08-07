'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inventory_items', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      tenant_id: {
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      item_type: {
        type: Sequelize.ENUM([
          'items',
          'labor',
          'travel',
        ]),
        defaultValue: 'items'
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      item_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sales_tax: {
        type: Sequelize.ENUM([
          'liable',
          'exempt',
        ]),
        defaultValue: 'liable'
      },
      inventory_item: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      sales_item: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      purchasing_item: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      item_management: {
        type: Sequelize.ENUM([
          'none',
          'serial',
          'batch',
        ]),
        defaultValue: 'none'
      },
      manufacturer: {
        allowNull: true,
        references: {
          model: 'manufacturers',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      item_group: {
        allowNull: true,
        references: {
          model: 'item_groups',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      barcode: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      addit_identifier: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      vendor_1: {
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      vendor_2: {
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      vendor_3: {
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      manuf_sku: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      purchasing_uom: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      purchasing_items_per_unit: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      purchasing_items_per_package: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      purchasing_packaging_uom: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      length: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      width: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      volume: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      sales_uom: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      sales_items_per_unit: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      sales_packaging_uom: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      sales_items_per_package: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      required_inv: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      minimum_inv: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      maximum_inv: {
        type: Sequelize.STRING ,
        allowNull: true,
      },
      warehouse_1: {
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      warehouse_2: {
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      warehouse_3: {
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      warehouse_4: {
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_1: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_2: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_3: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_4: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_5: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_6: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_7: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_8: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_9: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      prop_10: {
        allowNull: true,
        references: {
          model: 'item_properties',
          key: 'id',
        },
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM([
          'active',
          'inactive',
          'deleted',
        ]),
        defaultValue: 'active'
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('inventory_items');
  },
};
