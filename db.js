const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Matiin log SQL biar terminal gak nyampah
  pool: {
    max: 10,        // Maksimal 10 koneksi berbarengan
    min: 0,         // Minimal 0 biar hemat resource kalau lagi sepi
    acquire: 30000, // Maksimal 30 detik nunggu koneksi sebelum nyerah
    idle: 10000     // Kalau 10 detik koneksi bengong, lepasin secara baik-baik
  },
  dialectOptions: {
    // Tambahin KeepAlive biar gak diputus sepihak sama Railway
    keepAlive: true,
    // Fix SSL untuk server PostgreSQL di Cloud (Railway)
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
