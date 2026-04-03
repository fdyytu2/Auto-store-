const sqlite3 = require('sqlite3').verbose();
const config = require('./config');

const db = new sqlite3.Database(config.dbFile, (err) => {
    if (err) console.error('❌ Gagal konek database:', err.message);
    else {
        console.log('✅ Database SQLite terhubung.');
        initTables();
    }
});

function initTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Settings (key TEXT PRIMARY KEY, value TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS Guilds (guild_id TEXT PRIMARY KEY, prefix TEXT DEFAULT '!', tier TEXT DEFAULT 'basic')`);
        db.run(`CREATE TABLE IF NOT EXISTS Products (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, name TEXT, price INTEGER, stock INTEGER, FOREIGN KEY(guild_id) REFERENCES Guilds(guild_id))`);
        
        // Tabel baru buat sistem uang asli
        db.run(`CREATE TABLE IF NOT EXISTS Users (user_id TEXT, guild_id TEXT, balance INTEGER DEFAULT 0, PRIMARY KEY (user_id, guild_id))`);
        db.run(`CREATE TABLE IF NOT EXISTS Transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, guild_id TEXT, product_name TEXT, amount INTEGER, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    });
}

const getConfig = (key) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT value FROM Settings WHERE key = ?", [key], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.value : null);
        });
    });
};

module.exports = { db, getConfig };
