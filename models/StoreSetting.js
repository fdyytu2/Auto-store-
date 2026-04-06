const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const StoreSetting = sequelize.define('StoreSetting', {
  ownerId: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  danaNumber: { type: DataTypes.STRING, allowNull: true },
  qrisUrl: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'store_settings',
  timestamps: false
});

module.exports = StoreSetting;
