const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize

// Definisci il modello Genre
const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'genres',
  timestamps: false,
});

module.exports = Genre;
