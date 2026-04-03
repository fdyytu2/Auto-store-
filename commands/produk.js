module.exports = {
    name: 'produk',
    description: 'Lihat daftar produk PPOB',
    execute(message, args, db) {
        // Nanti di sini kita ganti pake data asli dari database/Digiflazz
        const text = `🛒 **DAFTAR PRODUK (Katalog Sementara)**\n\n` +
                     `**📱 Pulsa Telkomsel**\n` +
                     `• \`TSEL10\` - Rp 10.500\n` +
                     `• \`TSEL20\` - Rp 20.200\n\n` +
                     `**🎮 Mobile Legends**\n` +
                     `• \`ML86\` - 86 Diamond - Rp 20.000\n\n` +
                     `*Ketik \`!beli <kodeproduk> <tujuan>\` untuk order.*`;
        
        message.reply(text);
    }
};
