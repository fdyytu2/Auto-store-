const db = require('./models');

async function fix() {
  try {
    // alter: true bakal nambahin kolom yang kurang secara otomatis
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database berhasil diperbaiki dan kolom 'key' sudah ada!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal benerin database:", err);
    process.exit(1);
  }
}

fix();
