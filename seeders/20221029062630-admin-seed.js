'use strict';

/** @type {import('sequelize-cli').Migration} */
const { hashPassword } = require('../helpers/bcrypt')
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      full_name: 'kelompok 3',
      email: 'kelompok3@gmail.com',
      gender: 'male',
      password: hashPassword('kelompok3jaya!'),
      role: 0,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      full_name: 'kelompok 33',
      email: 'kelompok33@gmail.com',
      gender: 'female',
      password: hashPassword('kelompok3jaya!'),
      role: 1,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
