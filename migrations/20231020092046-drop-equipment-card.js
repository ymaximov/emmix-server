'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('equipment_card');
  },

  down: (queryInterface, Sequelize) => {
    // Define the "down" migration to recreate the table if needed
    return queryInterface.createTable('equipment_cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mfr_serial: Sequelize.STRING,
      serial_no: Sequelize.STRING,
      inv_item_id: Sequelize.INTEGER,
      customer_id: Sequelize.INTEGER,
      status: Sequelize.ENUM('active', 'terminated', 'loaned', 'in repair lab'),
      technician_id: Sequelize.INTEGER,
      delivery_id: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
};
