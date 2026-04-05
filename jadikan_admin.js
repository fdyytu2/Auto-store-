const db = require('./models');
db.sequelize.sync().then(async () => {
    // Cari user kentos5093 dan jadikan admin
    const user = await db.User.findOne({ where: { username: 'kentos5093' } });
    if (user) {
        user.role = 'admin';
        await user.save();
        console.log(`✅ Sultan ${user.username} resmi jadi Admin!`);
    } else {
        console.log('User belum ketemu di database.');
    }
    process.exit();
});
