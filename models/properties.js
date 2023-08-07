'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Property extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Property.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
        }
    }
    Property.init({
        tenant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tenants',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },

        name: {
            type: DataTypes.STRING,
            allowNull: true
        },


    }, {
        sequelize,
        modelName: 'item_properties',
    });
    return Property;
};