'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
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
      phone_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customer_type: {
        type: Sequelize.ENUM([
          'commerical',
          'government',
          'individual',
        ]),
        defaultValue: 'commerical'
      },
      payment_terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      late_interest: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cc_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cc_expiration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cc_security_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cc_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_account_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bic_swift: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_account_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_branch: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_signature_date: {
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
    return queryInterface.dropTable('customers');
  },
};
