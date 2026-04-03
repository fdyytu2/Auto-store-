const { Sequelize } = require('sequelize');
require('dotenv').config();

// HANYA GUNAKAN LINK PUBLIC VIP! Gak ada lagi cerita .internal
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:lEgVppLzpmGOHyDjsPYgrwQALwhSocYL@junction.proxy.rlwy.net:53059/railway';

console.log('📡 [DATABASE] Menghubungkan ke PostgreSQL Public VIP...');

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
