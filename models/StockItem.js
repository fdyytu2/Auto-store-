const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const StockItem = sequelize.define('StockItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false }, // Nyambung ke tabel Product
  ownerId: { type: DataTypes.STRING, allowNull: false },   // Gembok penyewa
  content: { type: DataTypes.TEXT, allowNull: false }       // Isi 1 baris (akun/token/data)
}, {
  tableName: 'stock_items',
  timestamps: true
});

module.exports = StockItem;
