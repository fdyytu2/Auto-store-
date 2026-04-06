const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deposit',
    description: 'Menampilkan informasi rekening toko',
    async execute(message, args, client, db) {
        const ownerId = client.ownerId;

        try {
            const setting = await db.StoreSetting.findOne({ where: { ownerId } });
            
            if (!setting || (!setting.danaNumber && !setting.qrisUrl)) {
                return message.reply('⚠️ Bos toko belum ngatur nomor rekening atau QRIS.');
            }

            const embed = new EmbedBuilder()
                .setTitle('💳 Informasi Deposit Saldo')
                .setColor('#00FF00')
                .setDescription('Silakan transfer ke rekening di bawah ini. Setelah transfer, hubungi Admin/Owner untuk menambah saldo.')
                .addFields(
                    { name: '💰 DANA / E-Wallet', value: setting.danaNumber ? `\`${setting.danaNumber}\`` : 'Belum diatur', inline: false }
                );

            if (setting.qrisUrl) embed.setImage(setting.qrisUrl);

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal memuat informasi deposit.');
        }
    }
};
