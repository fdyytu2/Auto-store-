const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'addsaldo',
    description: 'Top-up saldo pembeli (Admin Only)',
    async execute(message, args, client, db, tier) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Cuma admin toko yang bisa nambahin saldo!');
        }

        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!targetUser || isNaN(amount) || amount <= 0) {
            return message.reply('⚠️ Format salah! Gunakan: `!addsaldo @user nominal`');
        }

        try {
            const [user] = await db.User.findOrCreate({
                where: { user_id: targetUser.id, guild_id: message.guild.id },
                defaults: { balance: 0 }
            });

            // ORM: Langsung panggil increment buat nambah data numerik
            await user.increment('balance', { by: amount });
            
            message.channel.send(`✅ Berhasil top-up **${formatRupiah(amount)}** ke dompet ${targetUser}.`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal menambahkan saldo.');
        }
    }
};
