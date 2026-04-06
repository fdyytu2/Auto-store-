const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createStoreButtons(tier) {
    if (tier === 'basic') return null; // Kasta Basic gigit jari, gak dapet tombol

    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('btn_buy_modal') 
                .setLabel('🛒 Beli Produk')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('btn_set_target') 
                .setLabel('🎯 Set ID / Target')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('btn_check_balance') 
                .setLabel('💰 Cek Saldo')
                .setStyle(ButtonStyle.Secondary)
        );
}

module.exports = { createStoreButtons };
