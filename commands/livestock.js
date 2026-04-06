const { EmbedBuilder } = require('discord.js');
const { createStoreButtons } = require('../utils/componentBuilder');

module.exports = {
    name: 'livestock',
    description: 'Menampilkan Live Stock (Tombol otomatis hilang di kasta Basic)',
    async execute(message, args, client, db) {
        const ownerId = client.ownerId;

        // Cuma owner yang boleh manggil command ini
        if (message.author.id !== ownerId) {
            return message.reply('❌ Lu bukan bos toko ini. Hush sana!');
        }

        try {
            const sub = await db.Subscription.findOne({ where: { userId: ownerId } });
            const tier = sub ? sub.plan : 'basic';

            const products = await db.Product.findAll({ where: { ownerId }, limit: 15 });
            
            const embed = new EmbedBuilder()
                .setTitle('🛒 KATALOG & LIVE STOCK')
                .setColor('#2b2d31')
                .setDescription('Daftar produk yang tersedia saat ini:');

            if (products.length === 0) {
                embed.addFields({ name: 'Kosong', value: 'Bos toko belum masukin barang dagangan.' });
            } else {
                products.forEach(p => {
                    embed.addFields({ name: `🔹 ${p.name}`, value: `📦 Stok: **${p.stock}** | 💰 Harga: **Rp ${p.price}**\n📝 SKU: \`${p.sku}\`` });
                });
            }

            const row = createStoreButtons(tier);

            await message.channel.send({ 
                embeds: [embed], 
                components: row ? [row] : [] 
            });

            message.delete().catch(()=>console.log("Skip hapus command boss"));

        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal memuat Live Stock.');
        }
    }
};
