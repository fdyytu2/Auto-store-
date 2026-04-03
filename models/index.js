const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

let sequelize;
if (config.postgresUrl) {
    sequelize = new Sequelize(config.postgresUrl, { dialect: 'postgres', logging: false });
} else {
    sequelize = new Sequelize({ dialect: 'sqlite', storage: config.sqlitePath, logging: false });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 1. Panggil file skema
db.Setting = require('./Setting')(sequelize, DataTypes);
db.Guild = require('./Guild')(sequelize, DataTypes);
db.Product = require('./Product')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);

// 2. Bikin Relasi (Satu Server punya banyak Produk & banyak User)
db.Guild.hasMany(db.Product, { foreignKey: 'guild_id', sourceKey: 'guild_id' });
db.Product.belongsTo(db.Guild, { foreignKey: 'guild_id', targetKey: 'guild_id' });

db.Guild.hasMany(db.User, { foreignKey: 'guild_id', sourceKey: 'guild_id' });
db.User.belongsTo(db.Guild, { foreignKey: 'guild_id', targetKey: 'guild_id' });

// 3. Sinkronisasi (Bikin tabel otomatis kalau belum ada)
sequelize.sync({ alter: true })
    .then(() => console.log('✅ Semua tabel Database berhasil disinkronkan!'))
    .catch(err => console.error('❌ Gagal sinkronisasi DB:', err));

module.exports = db;
