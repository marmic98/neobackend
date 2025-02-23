const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('neo_db', 'root', 'NuovaEO1!', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
