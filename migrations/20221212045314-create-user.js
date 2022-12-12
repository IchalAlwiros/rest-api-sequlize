'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(192)
      },
      email: {
        type: Sequelize.STRING(192)
      },
      fullname: {
        type: Sequelize.STRING(192)
      },
      password: {
        type: Sequelize.STRING(192)
      },
      image: {
        type: Sequelize.STRING(192)
      },
      bio: {
        type: Sequelize.STRING(192)
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updateBy: {
        type: Sequelize.INTEGER
      },
      deletedBy: {
        type: Sequelize.INTEGER
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};