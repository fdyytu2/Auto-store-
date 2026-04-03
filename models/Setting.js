const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  botToken: {
    type: DataTypes.STRING,
    allowNull: true // Boleh kosong awal-awal, nanti diisi dari dashboard lu
  },
  maintenanceMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'settings',
  timestamps: true
});

module.exports = Setting;
