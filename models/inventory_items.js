// models/InventoryItem.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InventoryItem extends Model {
        static associate(models) {
            InventoryItem.belongsTo(models.tenants, { foreignKey: 'tenant_id' });
            InventoryItem.belongsTo(models.manufacturers, { foreignKey: 'manufacturer_id' });
            InventoryItem.belongsTo(models.item_groups, { foreignKey: 'item_group_id' });
            InventoryItem.belongsTo(models.warehouses, { foreignKey: 'default_wh' });
            InventoryItem.belongsTo(models.vendors, { foreignKey: 'vendor_1' });
            InventoryItem.belongsTo(models.vendors, { foreignKey: 'vendor_2' });
            InventoryItem.belongsTo(models.vendors, { foreignKey: 'vendor_3' });
            InventoryItem.belongsTo(models.warehouses, { foreignKey: 'warehouse_1' });
            InventoryItem.belongsTo(models.warehouses, { foreignKey: 'warehouse_2' });
            InventoryItem.belongsTo(models.warehouses, { foreignKey: 'warehouse_3' });
            InventoryItem.belongsTo(models.warehouses, { foreignKey: 'warehouse_4' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_1' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_2' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_3' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_4' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_5' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_6' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_7' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_8' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_9' });
            InventoryItem.belongsTo(models.item_properties, { foreignKey: 'prop_10' });
            InventoryItem.hasMany(models.inventories, { foreignKey: 'inv_item_id' });
            // Define other associations
        }
    }
    InventoryItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            tenant_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'tenants',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            default_wh: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'warehouses',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            item_type: {
                type: DataTypes.ENUM('items', 'labor', 'travel'),
                defaultValue: 'items',
            },
            item_name: {
               type: DataTypes.STRING,
                allowNull: true

            },
            item_description: DataTypes.STRING,
            sales_tax: DataTypes.BOOLEAN,
            inventory_item: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            sales_item: DataTypes.BOOLEAN,
            purchasing_item: DataTypes.BOOLEAN,
            item_management: {
                type: DataTypes.ENUM('none', 'serial', 'batch'),
                defaultValue: 'none',
                allowNull: true
            },
            manufacturer_id: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            item_group_id: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            barcode: {
               type: DataTypes.STRING,
                allowNull: true
            },
            addit_identifier: DataTypes.STRING,
            country: DataTypes.STRING,
            vendor_1: DataTypes.INTEGER,
            vendor_2: DataTypes.INTEGER,
            vendor_3: DataTypes.INTEGER,
            manuf_sku: DataTypes.STRING,
            purchasing_uom: DataTypes.STRING,
            purchasing_items_per_unit: DataTypes.STRING,
            purchasing_items_per_package: DataTypes.STRING,
            purchasing_packaging_uom: DataTypes.STRING,
            length: DataTypes.STRING,
            width: DataTypes.STRING,
            height: DataTypes.STRING,
            volume: DataTypes.STRING,
            weight: DataTypes.STRING,
            sales_uom: DataTypes.STRING,
            sales_items_per_unit: DataTypes.STRING,
            sales_packaging_uom: DataTypes.STRING,
            sales_items_per_package: DataTypes.STRING,
            required_inv: DataTypes.STRING,
            minimum_inv: DataTypes.STRING,
            maximum_inv: DataTypes.STRING,
            warehouse_1: DataTypes.INTEGER,
            warehouse_2: DataTypes.INTEGER,
            warehouse_3: DataTypes.INTEGER,
            warehouse_4: DataTypes.INTEGER,
            cost: DataTypes.STRING,
            price: DataTypes.STRING,
            prop_1: DataTypes.BOOLEAN,
            prop_2: DataTypes.BOOLEAN,
            prop_3: DataTypes.BOOLEAN,
            prop_4: DataTypes.BOOLEAN,
            prop_5: DataTypes.BOOLEAN,
            prop_6: DataTypes.BOOLEAN,
            prop_7: DataTypes.BOOLEAN,
            prop_8: DataTypes.BOOLEAN,
            prop_9: DataTypes.BOOLEAN,
            prop_10: DataTypes.BOOLEAN,
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'deleted'),
                defaultValue: 'active',
            },

        },
        {
            sequelize,
            modelName: 'inventory_items',
        }
    );
    return InventoryItem;
};
