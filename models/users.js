'use strict';

const {
  Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.tenants, { foreignKey: 'tenant_id' })
    }
  }
  User.init({
    first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
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
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
    buyer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    sales_rep: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    technician: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  account_status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive', 'deleted'],
    defaultValue: 'active',
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'super user', 'professional user', 'standard user'],
    defaultValue: 'super user',
    allowNull: false
  },
  }, {
    sequelize,
    modelName: 'users',
  });
  return User;
};