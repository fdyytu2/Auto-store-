const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Cek apakah ada URL Database dari Railway
if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  sequelize = new Sequelize(dbUrl, {
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
  console.log('📡 [DATABASE] Menggunakan PostgreSQL (Railway Mode)');
} else {
  // Kalau di Termux (Lokal), baru boleh pake SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('📁 [DATABASE] Menggunakan SQLite (Local Mode)');
}

module.exports = sequelize;
