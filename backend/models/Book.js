const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English'
  },
  hasAudio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  audioDuration: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Book;
