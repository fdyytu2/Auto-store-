const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'produk',
    description: 'Melihat daftar produk di toko ini',
    async execute(message, args, client, db) {
        const ownerId = client.ownerId; // Ambil KTP pemilik bot

        try {
            const products = await db.Product.findAll({
                where: { ownerId: ownerId }
            });

            if (products.length === 0) {
                return message.reply('🏪 Toko ini belum memiliki produk dagangan.');
            }

            let daftar = `📦 **DAFTAR PRODUK TOKO**\n\n`;
            products.forEach(p => {
                daftar += `🔹 **${p.name}**\n   └ SKU: \`${p.sku}\` | Harga: ${formatRupiah(p.price)} | Stok: ${p.stock}\n`;
            });
            daftar += `\n🛒 Cara beli: \`!beli [SKU] [Target]\``;

            message.reply(daftar);
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal mengambil daftar produk.');
        }
    }
};
