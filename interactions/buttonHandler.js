const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

async function handleButton(interaction, client, db) {
    const ownerId = client.ownerId;
    const discordId = interaction.user.id;

    try {
        // 1. TOMBOL CEK SALDO (Langsung bales, gak usah pop-up)
        if (interaction.customId === 'btn_check_balance') {
            const wallet = await db.Wallet.findOne({ where: { ownerId, discordId } });
            const saldo = wallet ? wallet.saldo : 0;
            const targetId = wallet && wallet.targetId ? wallet.targetId : 'Belum diatur';
            
            return interaction.reply({ 
                content: `💰 **Saldo Kamu:** Rp ${saldo.toLocaleString('id-ID')}\n🎯 **Target ID:** ${targetId}\n\n*(Pesan ini rahasia, cuma kamu yang bisa lihat 🔒)*`, 
                ephemeral: true 
            });
        }

        // 2. TOMBOL SET TARGET ID (Buka Pop-up)
        if (interaction.customId === 'btn_set_target') {
            const modal = new ModalBuilder()
                .setCustomId('modal_set_target')
                .setTitle('🎯 Set ID / Target Transaksi');
            
            const targetInput = new TextInputBuilder()
                .setCustomId('input_target')
                .setLabel('Masukkan ID Game / Email / No HP')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Contoh: bayu_pro / 08123456')
                .setRequired(true);
            
            const row = new ActionRowBuilder().addComponents(targetInput);
            modal.addComponents(row);
            
            return interaction.showModal(modal);
        }

        // 3. TOMBOL BELI PRODUK (Buka Pop-up)
        if (interaction.customId === 'btn_buy_modal') {
            const modal = new ModalBuilder()
                .setCustomId('modal_buy')
                .setTitle('🛒 Beli Produk');
            
            const skuInput = new TextInputBuilder()
                .setCustomId('input_sku')
                .setLabel('Masukkan Kode Produk (SKU)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Contoh: ML86')
                .setRequired(true);
            
            const row = new ActionRowBuilder().addComponents(skuInput);
            modal.addComponents(row);
            
            return interaction.showModal(modal);
        }
    } catch (error) {
        console.error("Error di buttonHandler:", error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Terjadi kesalahan sistem.', ephemeral: true });
        }
    }
}

module.exports = { handleButton };
