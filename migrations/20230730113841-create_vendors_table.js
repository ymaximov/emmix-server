'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vendors', {
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
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pcontact_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vendor_type: {
        type: Sequelize.ENUM([
          'commercial',
          'government',
          'education',
          'individual',
        ]),
      },
      sales_tax: {
        type: Sequelize.ENUM([
          'liable',
          'exempt',
        ]),
        defaultValue: 'liable'
      },
      payment_terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      late_interest: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    return queryInterface.dropTable('vendors');
  },
};
