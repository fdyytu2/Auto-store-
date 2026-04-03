const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'saldo',
    description: 'Cek saldo uang asli di toko ini',
    async execute(message, args, client, db, tier) {
        try {
            // ORM: Cari user, kalau belum pernah belanja/top-up otomatis dibikinin saldo 0
            const [user] = await db.User.findOrCreate({
                where: { user_id: message.author.id, guild_id: message.guild.id },
                defaults: { balance: 0 }
            });

            message.reply(`💳 Saldo kamu saat ini: **${formatRupiah(user.balance)}**`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Terjadi kesalahan sistem.');
        }
    }
};
