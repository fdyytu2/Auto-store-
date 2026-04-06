const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ownerId: { type: DataTypes.STRING, allowNull: false }, // ID Pemilik Toko
    sku: { type: DataTypes.STRING, allowNull: false },     // Kode Barang (Misal: ML86)
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'products',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['ownerId', 'sku'] } // SKU gak boleh kembar di 1 toko
    ]
});

module.exports = Product;
