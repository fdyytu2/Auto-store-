const db = require('../models');

module.exports = {
    name: 'menu',
    description: 'Menu japri yang beda buat Sultan dan User biasa',
    async execute(message, args) {
        // Cek apakah pesan ini dikirim di DM (japri) atau di dalam Grup
        if (message.guild) {
            return message.reply('❌ Command `!menu` ini khusus dipake buat Japri (DM) aja Bos!');
        }

        try {
            // Cari KTP yang ngetik di database
            const user = await db.User.findOne({ where: { discordId: message.author.id } });

            if (!user) {
                return message.reply('❌ Lu belum terdaftar di sistem. Login ke web PPOB dulu bre!');
            }

            // Pisahin menu berdasarkan pangkat
            if (user.role === 'admin') {
                return message.reply(`👑 **KONTROL PANEL SULTAN KORA** 👑
Halo Admin ${user.username}!
1. \`!stats\` - Cek kondisi jeroan server
2. \`!restart\` - (Segera Hadir) Restart mesin
3. \`!errorlog\` - (Segera Hadir) Cek laporan error`);
            } else {
                return message.reply(`🛍️ **MENU PPOB KORA** 🛍️
Halo Kak ${user.username}!
1. \`!saldo\` - Cek sisa saldo
2. \`!harga\` - Cek daftar harga pulsa/game
3. \`!beli\` - Mulai transaksi`);
            }

        } catch (error) {
            console.error('Error di menu japri:', error);
            message.reply('Aduh, sistem database lagi pusing bre.');
        }
    }
};
