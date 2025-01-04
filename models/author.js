const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize

// Definisci il modello Author
const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ig: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'authors',
  timestamps: false,
});

module.exports = Author;
