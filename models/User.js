const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discordId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  saldo: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avatar: { type: DataTypes.STRING, allowNull: true },
    role: {
    type: DataTypes.STRING,
    defaultValue: 'user' // 'admin' atau 'user'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
