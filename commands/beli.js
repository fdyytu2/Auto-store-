const { formatRupiah } = require('../utils/helpers');

module.exports = {
    name: 'beli',
    description: 'Beli barang menggunakan saldo uang asli',
    async execute(message, args, client, db, tier) {
        const productId = parseInt(args[0]);

        if (isNaN(productId)) {
            return message.reply('⚠️ Format salah! Gunakan: `!beli [ID_Barang]`');
        }

        // Mulai Transaksi Terisolasi (Mencegah Race Condition/Bug Saldo Minus)
        const t = await db.sequelize.transaction();

        try {
            // 1. Cek Produk
            const product = await db.Product.findOne({ 
                where: { id: productId, guild_id: message.guild.id },
                transaction: t 
            });

            if (!product) {
                await t.rollback();
                return message.reply('❌ Barang tidak ditemukan di toko ini.');
            }
            if (product.stock <= 0) {
                await t.rollback();
                return message.reply('❌ Maaf, stok barang ini sedang kosong.');
            }

            // 2. Cek Saldo Pembeli
            const [user] = await db.User.findOrCreate({
                where: { user_id: message.author.id, guild_id: message.guild.id },
                defaults: { balance: 0 },
                transaction: t
            });

            if (user.balance < product.price) {
                await t.rollback();
                return message.reply(`❌ Saldo tidak cukup! Harga barang **${formatRupiah(product.price)}**, sedangkan saldo kamu **${formatRupiah(user.balance)}**.`);
            }

            // 3. Eksekusi Transaksi (Potong saldo, kurangi stok)
            await user.decrement('balance', { by: product.price, transaction: t });
            await product.decrement('stock', { by: 1, transaction: t });

            // Simpan perubahan ke database
            await t.commit();

            // 4. Kirim Konfirmasi
            message.author.send(`🎉 **Terima kasih telah berbelanja!**\nKamu telah membeli **${product.name}** seharga ${formatRupiah(product.price)}.\n*(Ini adalah simulasi pengiriman produk)*`).catch(() => {
                message.channel.send(`⚠️ ${message.author}, DM kamu tertutup! Buka pengaturan privasi DM-mu.`);
            });
            
            message.reply(`✅ Berhasil membeli **${product.name}**! Saldo berhasil dipotong.`);

        } catch (error) {
            // Batalkan semua perubahan kalau ada error di tengah jalan
            await t.rollback();
            console.error(error);
            message.reply('❌ Transaksi gagal diproses. Saldo aman dan tidak terpotong.');
        }
    }
};
