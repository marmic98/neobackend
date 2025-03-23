const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la configurazione di Sequelize
const Author = require('./author'); // Importa il modello Author
const Genre = require('./genre');

// Definisci il modello Comic
const Comic = sequelize.define('Comic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  visuals: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  chapterNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sceneggiatore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  disegnatore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  colorista: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'comics',
  timestamps: false,
});

//Definisci la relazione 1-a-molti tramite l'attributo sceneggiatore della tabella COmics (Fumetto)
Author.hasMany(Comic, {
  foreignKey: 'sceneggiatore',
  as: 'fumettiScritti'
});

//Definisci la relazione 1-a-molti tramite l'attributo disegnatore della tabella COmics (Fumetto)
Author.hasMany(Comic, {
  foreignKey: 'disegnatore',
  as: 'fumettiDisegnati'
});

//Definisci la relazione 1-a-molti tramite l'attributo colorista della tabella COmics (Fumetto)
Author.hasMany(Comic, {
  foreignKey: 'colorista',
  as: 'fumettiColorati'
});

Comic.belongsTo(Author, {
  foreignKey: 'sceneggiatore',
  as: 'Sceneggiatore'
});

Comic.belongsTo(Author, {
  foreignKey: 'disegnatore',
  as: 'Disegnatore'
});

Comic.belongsTo(Author, {
  foreignKey: 'colorista',
  as: 'Colorista'
});

// Definisci la relazione molti-a-molti tramite la tabella intermedia ComicGenre
Genre.belongsToMany(Comic, {
  through: 'ComicGenre',
  foreignKey: 'genreId',
})

Comic.belongsToMany(Genre, { 
  through: 'ComicGenre',
  foreignKey: 'comicId',
})

module.exports = Comic;
