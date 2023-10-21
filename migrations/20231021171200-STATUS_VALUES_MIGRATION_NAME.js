'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add new columns to the 'users' table
      await queryInterface.addColumn('users', 'technician', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }, { transaction: t });

      await queryInterface.addColumn('users', 'sales_rep', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }, { transaction: t });

      await queryInterface.addColumn('users', 'buyer', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }, { transaction: t });

      // Update enum values in the 'service_contracts' table
      const tableName = 'service_contracts';
      const columnName = 'status';
      const newStatusValues = ['draft', 'open', 'terminated', 'on hold'];

      await queryInterface.sequelize.query(
          `CREATE TYPE enum_${tableName}_${columnName} AS ENUM (${newStatusValues.map(value => `'${value}'`).join(', ')})`,
          { transaction: t }
      );

      await queryInterface.changeColumn(tableName, columnName, {
        type: `enum_${tableName}_${columnName}`,
        using: `${columnName}::enum_${tableName}_${columnName}`,
      }, { transaction: t });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Remove new columns from the 'users' table
      await queryInterface.removeColumn('users', 'technician', { transaction: t });
      await queryInterface.removeColumn('users', 'sales_rep', { transaction: t });
      await queryInterface.removeColumn('users', 'buyer', { transaction: t });

      // Revert enum values in the 'service_contracts' table
      const tableName = 'service_contracts';
      const columnName = 'status';
      const previousStatusValues = ['your_previous_values_here'];

      await queryInterface.changeColumn(tableName, columnName, {
        type: `ENUM(${previousStatusValues.map(value => `'${value}'`).join(', ')}`,
      }, { transaction: t });

      await queryInterface.sequelize.query(
          `DROP TYPE IF EXISTS enum_${tableName}_${columnName}`,
          { transaction: t }
      );
    });
  },
};
