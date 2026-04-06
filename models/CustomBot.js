const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const CustomBot = sequelize.define('CustomBot', {
  ownerId: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  botToken: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  prefix: { 
    type: DataTypes.STRING, 
    defaultValue: '!' 
  },
  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'error'), 
    defaultValue: 'inactive' 
  },
  liveStockChannel: { 
    type: DataTypes.STRING, 
    allowNull: true // Di sini user nyimpen ID Channel Discord mereka
  }
}, {
  tableName: 'custom_bots',
  timestamps: true
});

module.exports = CustomBot;
