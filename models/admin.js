const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize

// Definisci il modello user
const Admin = sequelize.define('Admin', {
  us: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  psw: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'admin',
  timestamps: false,
});

module.exports = Admin;
