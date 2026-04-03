const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway otomatis kasih DATABASE_URL, tapi kita siapin fallback pake link yang lu kasih
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://postgres:lEgVppLzpmGOHyDjsPYgrwQALwhSocYL@postgres.railway.internal:5432/railway';

console.log('📡 [DATABASE] Menghubungkan ke PostgreSQL...');

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
