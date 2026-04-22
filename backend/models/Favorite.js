const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Book = require('./Book');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.STRING,
    references: {
      model: Book,
      key: 'id'
    }
  }
});

// Associations
User.hasMany(Favorite, { foreignKey: 'userId', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Favorite, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Favorite.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = Favorite;
