const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'beli',
    description: 'Beli barang menggunakan SKU',
    async execute(message, args, client, db, tier) {
        // Ambil ID Bos/Pemilik dari memori bot (Nanti kita setting di botManager)
        const ownerId = client.ownerId || process.env.OWNER_ID; 

        if (!args[0]) {
            return message.reply('⚠️ Format salah! Gunakan: `!beli [SKU] [Target/ID Game]`\nContoh: `!beli ML86 12345678`');
        }

        const sku = args[0].toUpperCase();
        const target = args[1] || 'Tidak ada target';

        // Mulai Transaksi Terisolasi (ACID)
        const t = await db.sequelize.transaction();

        try {
            // 1. Cari produk berdasarkan SKU di toko ini aja
            const product = await db.Product.findOne({
                where: { sku: sku, ownerId: ownerId },
                transaction: t
            });

            if (!product) {
                await t.rollback();
                return message.reply(`❌ Barang dengan SKU **${sku}** tidak ditemukan di toko ini.`);
            }
            if (product.stock <= 0) {
                await t.rollback();
                return message.reply(`❌ Maaf, stok barang **${product.name}** sedang kosong.`);
            }

            // 2. Cek Dompet Pembeli (Pakai tabel Wallet!)
            const [wallet] = await db.Wallet.findOrCreate({
                where: { discordId: message.author.id, ownerId: ownerId },
                defaults: { saldo: 0 },
                transaction: t
            });

            if (wallet.saldo < product.price) {
                await t.rollback();
                return message.reply(`❌ Saldo kurang! Harga: **${formatRupiah(product.price)}**, Saldo kamu: **${formatRupiah(wallet.saldo)}**.`);
            }

            // 3. Eksekusi: Potong saldo, kurangi stok
            await wallet.decrement('saldo', { by: product.price, transaction: t });
            await product.decrement('stock', { by: 1, transaction: t });

            // 4. Catat Transaksi
            await db.Transaction.create({
                ownerId: ownerId,
                userId: message.author.id,
                sku: sku,
                target: target,
                price: product.price,
                status: 'success'
            }, { transaction: t });

            // Simpan perubahan ke database
            await t.commit();

            message.reply(`✅ Berhasil membeli **${product.name}** (SKU: ${sku})!\n*Target:* ${target}\nSaldo berhasil dipotong ${formatRupiah(product.price)}.`);

        } catch (error) {
            await t.rollback();
            console.error("Error Transaksi:", error);
            message.reply('❌ Sistem sedang sibuk. Saldo aman dan tidak terpotong.');
        }
    }
};
