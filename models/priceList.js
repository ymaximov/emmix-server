'use strict';

const {
    Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PriceList extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PriceList.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
            PriceList.hasMany(models.price_entries, {foreignKey: 'price_list_id'})
        }
    }
    PriceList.init({
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
        modelName: 'price_lists',
    });
    return PriceList;
};