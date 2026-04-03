const db = require('./models');

async function kastaSultan() {
  const myDiscordId = '1035189920488235120'; // ID Lu

  try {
    console.log('⏳ RESET PABRIK DATABASE...');
    // PERHATIAN: { force: true } bakal ngehapus semua tabel dan bikin baru
    await db.sequelize.sync({ force: true });

    console.log('✅ Tabel baru berhasil dibuat! Menyuntikkan role Admin...');

    // 1. Bikin User Admin Baru
    const user = await db.User.create({
      discordId: myDiscordId,
      username: 'Owner_PPOB',
      role: 'admin',
      saldo: 1000000
    });

    // 2. Bikin Paket Ultra Baru
    if (db.Subscription) {
        await db.Subscription.create({
          userId: myDiscordId,
          plan: 'ultra',
          expiredAt: new Date('2099-12-31')
        });
        console.log('💎 Paket ULTRA: AKTIF');
    }

    console.log('✅ Role: SUPER ADMIN. Reset Selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal eksekusi:', err.message);
    process.exit(1);
  }
}

kastaSultan();
