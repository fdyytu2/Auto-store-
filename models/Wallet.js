const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Wallet = sequelize.define('Wallet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.STRING, allowNull: false }, // ID Pemilik Toko
  discordId: { type: DataTypes.STRING, allowNull: false }, // ID Pembeli
  saldo: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'wallets',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['ownerId', 'discordId'] } // 1 Pelanggan = 1 Dompet di 1 Toko
  ]
});

module.exports = Wallet;
