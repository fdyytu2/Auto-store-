const db = require('../models');

module.exports = {
    name: 'sultan',
    description: 'Cek apakah bot mengenali Bosnya',
    async execute(message, args) {
        try {
            // Kora nyari KTP orang yang ngetik di database
            const user = await db.User.findOne({ where: { discordId: message.author.id } });

            // Kalau gak ada di database (Belum pernah login web)
            if (!user) {
                return message.reply('❌ Lu siapa bre? KTP lu gak kedaftar di sistem Kora! Login ke web dulu sana.');
            }

            // Kalau ketemu, Kora ngecek pangkatnya
            if (user.role === 'admin') {
                return message.reply(`👑 **AMPUUUN BANG JAGO!** Selamat datang Sultan **${user.username}**. Kora siap laksanakan perintah!`);
            } else {
                return message.reply(`👋 Halo kroco... eh maksudnya User **${user.username}**. Mau jajan PPOB apa hari ini?`);
            }

        } catch (error) {
            console.error('Error di command sultan:', error);
            return message.reply('Pusing bre, database lagi error.');
        }
    }
};
