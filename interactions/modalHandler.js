const { AttachmentBuilder } = require('discord.js');

async function handleModal(interaction, client, db) {
    const ownerId = client.ownerId;
    const discordId = interaction.user.id;

    if (interaction.customId === 'modal_buy') {
        const skuInput = interaction.fields.getTextInputValue('input_sku').toUpperCase();
        const t = await db.sequelize.transaction();

        try {
            const product = await db.Product.findOne({ where: { sku: skuInput, ownerId }, transaction: t });
            if (!product || product.stock <= 0) {
                await t.rollback();
                return interaction.reply({ content: '❌ Produk tidak ditemukan atau stok habis.', ephemeral: true });
            }

            const wallet = await db.Wallet.findOne({ where: { discordId, ownerId }, transaction: t });
            if (!wallet || wallet.saldo < product.price) {
                await t.rollback();
                return interaction.reply({ content: '❌ Saldo kamu tidak cukup.', ephemeral: true });
            }

            // 🔥 AMBIL BARANG DIGITAL DARI GUDANG (BARIS PALING LAMA/ATAS)
            const item = await db.StockItem.findOne({
                where: { productId: product.id, ownerId },
                order: [['createdAt', 'ASC']],
                transaction: t
            });

            if (!item) {
                await t.rollback();
                return interaction.reply({ content: '❌ Error: Data stok tidak sinkron. Hubungi Admin.', ephemeral: true });
            }

            // Potong Saldo, Kurangi Stok, Hapus Item yang dibeli
            await wallet.decrement('saldo', { by: product.price, transaction: t });
            await product.decrement('stock', { by: 1, transaction: t });
            await item.destroy({ transaction: t });

            await t.commit();

            // 📂 Bikin file .txt buat dikirim ke buyer
            const buffer = Buffer.from(item.content, 'utf-8');
            const file = new AttachmentBuilder(buffer, { name: `Order_${skuInput}.txt` });

            await interaction.user.send({
                content: `🎉 **Terima kasih telah membeli ${product.name}!**\nBerikut adalah data produk kamu:`,
                files: [file]
            }).catch(() => {
                return interaction.reply({ content: '❌ DM kamu tertutup! Silakan buka DM dan hubungi admin.', ephemeral: true });
            });

            return interaction.reply({ content: `✅ Pembelian **${product.name}** berhasil! Cek DM kamu untuk mengambil barang.`, ephemeral: true });

        } catch (err) {
            if (t) await t.rollback();
            console.error(err);
            interaction.reply({ content: '❌ Terjadi kesalahan transaksi.', ephemeral: true });
        }
    }
}
module.exports = { handleModal };
