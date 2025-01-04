const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize

// Definisci il modello user
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscribeDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  unsubscribeDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'user',
  timestamps: false,
});

module.exports = User;
