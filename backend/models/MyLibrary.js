const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Book = require('./Book');

const MyLibrary = sequelize.define('MyLibrary', {
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
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MyLibrary',
  timestamps: false // We use addedAt manually
});

// Associations
User.hasMany(MyLibrary, { foreignKey: 'userId', onDelete: 'CASCADE' });
MyLibrary.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(MyLibrary, { foreignKey: 'bookId', onDelete: 'CASCADE' });
MyLibrary.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = MyLibrary;
