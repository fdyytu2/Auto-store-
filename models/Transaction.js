const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.STRING, allowNull: false }, // ID Pemilik Toko
  userId: { type: DataTypes.STRING, allowNull: false },  // ID Pembeli
  sku: { type: DataTypes.STRING, allowNull: false },     // Pake SKU, bukan nama
  target: { type: DataTypes.STRING, allowNull: false },  // No HP / ID Game target
  price: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  sn: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
