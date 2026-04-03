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
    allowNull: false
  },
  botToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prefix: {
    type: DataTypes.STRING,
    defaultValue: '!'
  },
  status: {
    // Kita ganti STRING biar Postgres gak rewel, fungsinya tetep sama kok
    type: DataTypes.STRING,
    defaultValue: 'active' // active, inactive, atau expired
  }
}, {
  tableName: 'custom_bots',
  timestamps: true
});

module.exports = CustomBot;
