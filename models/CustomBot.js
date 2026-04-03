const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CustomBot = sequelize.define('CustomBot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false // Wajib ada ID Discord penyewanya
  },
  botToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prefix: {
    type: DataTypes.STRING,
    defaultValue: '!' // Penyewa bisa ganti prefix nanti
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active'
  }
}, {
  tableName: 'custom_bots',
  timestamps: true
});

module.exports = CustomBot;
