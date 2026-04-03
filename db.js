const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.POSTGRES_URL) {
  // Mode Produksi (Railway)
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
  console.log('📡 Connected to PostgreSQL (Cloud)');
} else {
  // Mode Lokal (Termux) - Tetap pakai SQLite biar lu bisa ngetik tanpa kuota
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('📁 Connected to SQLite (Local)');
}

module.exports = sequelize;
