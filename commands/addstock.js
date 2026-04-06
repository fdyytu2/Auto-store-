const axios = require('axios');

module.exports = {
    name: 'addstock',
    description: 'Tambah stok digital lewat file .txt',
    async execute(message, args, client, db) {
        const ownerId = client.ownerId;
        if (message.author.id !== ownerId) return message.reply('❌ Bukan owner!');

        const attachment = message.attachments.first();
        const skuInput = args[0]?.toUpperCase();

        if (!attachment || !attachment.name.endsWith('.txt') || !skuInput) {
            return message.reply('⚠️ Gunakan: `!addstock [SKU]` sambil melampirkan file `.txt`');
        }

        try {
            const product = await db.Product.findOne({ where: { sku: skuInput, ownerId } });
            if (!product) return message.reply(`❌ SKU **${skuInput}** belum terdaftar di produk.`);

            // Download dan baca isi file
            const response = await axios.get(attachment.url);
            const lines = response.data.split(/\r?\n/).filter(line => line.trim() !== "");

            // Simpan tiap baris ke database
            const stockData = lines.map(line => ({
                productId: product.id,
                ownerId: ownerId,
                content: line
            }));

            await db.StockItem.bulkCreate(stockData);
            
            // Update jumlah stok di tabel Product
            await product.increment('stock', { by: lines.length });

            message.reply(`✅ Berhasil menambahkan **${lines.length}** stok ke produk **${product.name}**.`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Gagal memproses file stok.');
        }
    }
};
