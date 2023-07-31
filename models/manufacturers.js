'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Manufacturer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Manufacturer.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
        }
    }
    Manufacturer.init({
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
            allowNull: false
        },


    }, {
        sequelize,
        modelName: 'manufacturers',
    });
    return Manufacturer;
};