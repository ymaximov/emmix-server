'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Raw SQL query to insert data
    const query = `
      INSERT INTO item_groups (name, tenant_id, createdAt, updatedAt)
      VALUES
        ('Group A', '15', NOW(), NOW())
    `;

    // Execute the query
    await queryInterface.sequelize.query(query);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted data
    await queryInterface.bulkDelete('item_groups', null, {});
  }
};
