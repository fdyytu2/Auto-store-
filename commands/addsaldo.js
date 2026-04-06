const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'addsaldo',
    description: 'Menambah saldo pelanggan (Owner Only)',
    async execute(message, args, client, db) {
        const ownerId = client.ownerId;

        // Cek apakah yang ngetik adalah pemilik bot ini
        if (message.author.id !== ownerId) {
            return message.reply('❌ Cuma pemilik bot yang bisa pakai perintah ini!');
        }

        const targetUser = message.mentions.users.first();
        const jumlah = parseInt(args[1]);

        if (!targetUser || isNaN(jumlah)) {
            return message.reply('⚠️ Format: `!addsaldo @User [Jumlah]`');
        }

        try {
            const [wallet] = await db.Wallet.findOrCreate({
                where: { discordId: targetUser.id, ownerId: ownerId },
                defaults: { saldo: 0 }
            });

            await wallet.increment('saldo', { by: jumlah });
            
            message.reply(`✅ Berhasil menambah saldo **${targetUser.username}** sebesar **${formatRupiah(jumlah)}**.\nSaldo sekarang: ${formatRupiah(wallet.saldo + jumlah)}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal menambah saldo.');
        }
    }
};
