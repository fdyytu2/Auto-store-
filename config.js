require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET || 'rahasia_default',
    postgresUrl: process.env.POSTGRES_URL, // URL Postgres dari .env
    sqlitePath: './database.sqlite' // Path buat SQLite lokal
};
