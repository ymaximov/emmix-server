'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service_contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tenants',
          key: 'id',
          allowNull: false,
        },
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
          allowNull: false,
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('draft', 'approved', 'on hold', 'terminated'),
        defaultValue: 'draft',
        allowNull: true,
      },
      renewal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      service_type: {
        type: Sequelize.ENUM('regular', 'warranty'),
        defaultValue: 'regular'
      },
      contract_type: {
        type: Sequelize.ENUM('service', 'equipment'),
        defaultValue: 'service'
      },
      response_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      response_time_type: {
        type: Sequelize.ENUM('hours', 'days'),
        defaultValue: 'hours'
      },
      resolution_time: {
        type: Sequelize.INTEGER,
        allowNull: true

      },
      resolution_time_type: {
        type: Sequelize.ENUM('hours', 'days'),
        defaultValue: 'hours'
      },
      monday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true
      },
      tuesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      wednesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      thursday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      friday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      saturday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      sunday: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      monday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      monday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      tuesday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      tuesday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      wednesday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      wednesday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      thursday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      thursday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      friday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      friday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      saturday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      saturday_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      sunday_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
     sunday_end_time: {
        type: Sequelize.TIME,
       allowNull: true
      },
      parts: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      labor: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      travel: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      holidays: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('service_contracts');
  },
};
