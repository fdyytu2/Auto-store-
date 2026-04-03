const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'stok',
    description: 'Melihat live stock toko',
    async execute(message, args, client, db, tier) {
        try {
            // ORM: Langsung cari semua produk di server ini
            const products = await db.Product.findAll({ 
                where: { guild_id: message.guild.id },
                order: [['id', 'ASC']]
            });
            
            if (!products || products.length === 0) {
                return message.reply('📦 Toko ini belum memiliki barang jualan.');
            }

            let response = `**📊 Live Stock Toko (Tier: ${tier.toUpperCase()})**\n\n`;
            products.forEach((item, index) => {
                response += `${item.id}. **${item.name}** - ${formatRupiah(item.price)} (Sisa: ${item.stock})\n`;
            });

            message.channel.send(response);
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal membaca database toko.');
        }
    }
};
