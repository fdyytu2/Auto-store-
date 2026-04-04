const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaction = sequelize.define('Transaction', {
  userId: { type: DataTypes.STRING, allowNull: false },
  productName: { type: DataTypes.STRING, allowNull: false },
  target: { type: DataTypes.STRING, allowNull: false }, // No HP / ID Game target
  price: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, processing, success, failed
  sn: { type: DataTypes.STRING, allowNull: true } // Serial Number / Bukti sukses dari Digiflazz
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
