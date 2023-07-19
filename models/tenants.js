'use strict';
const {
  Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Tenant.hasMany(User);
      Tenant.hasMany(models.users,{ foreignKey: 'tenant_id' })
    }
  }
  Tenant.init({
    company_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address_1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address_2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive', "deleted"],
      defaultValue: 'active',
      allowNull: false
    },
    security_code: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'tenants',
  });
  return Tenant;
};