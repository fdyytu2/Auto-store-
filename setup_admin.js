const db = require('./models');

async function kastaSultan() {
  const myDiscordId = '1035189920488235120'; 
  try {
    await db.sequelize.sync();
    const [user] = await db.User.findOrCreate({
      where: { discordId: myDiscordId },
      defaults: { username: 'Owner', role: 'admin' }
    });
    user.role = 'admin';
    await user.save();
    console.log('✅ Akun lu resmi jadi SUPER ADMIN!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal:', err);
    process.exit(1);
  }
}
kastaSultan();
