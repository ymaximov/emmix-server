'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the user_id column to receiver_user_id
    await queryInterface.renameColumn('goods_receipts', 'user_id', 'receiver_id');

    // Add a new column buyer_id that relates to users.id
    await queryInterface.addColumn('goods_receipts', 'buyer_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // Name of the target table
        key: 'id',      // Name of the target column
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE' or 'SET DEFAULT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse the changes: Rename receiver_user_id back to user_id and remove the buyer_id column
    await queryInterface.renameColumn('goods_receipts', 'receiver_user_id', 'user_id');
    await queryInterface.removeColumn('goods_receipts', 'buyer_id');
  },
};
