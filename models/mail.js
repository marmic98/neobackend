const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize

// Definisci il modello Genre
const Mail = sequelize.define('Mail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  oggetto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  corpo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataInvio: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'mail',
  timestamps: false,
});

module.exports = Mail;
