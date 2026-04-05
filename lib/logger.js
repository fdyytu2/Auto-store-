const db = require('../models');

const reportError = async (error, context = 'General') => {
    console.error(`[ERROR - ${context}]:`, error);

    // Kalau bot lagi online, suruh dia lapor ke Admin
    if (global.mainBot && global.mainBot.ws.status === 0) {
        try {
            // Cari ID Discord lu (Sultan) di database
            const admin = await db.User.findOne({ where: { role: 'admin' } });
            if (admin) {
                const adminUser = await global.mainBot.users.fetch(admin.discordId);
                const errorMessage = error.stack || error.message || error;
                
                await adminUser.send(`⚠️ **LAPOR BOS! ADA ERROR DI MESIN!** ⚠️
=================================
📍 **Lokasi/Konteks**: ${context}
📝 **Pesan Error**: 
\`\`\`js
${errorMessage.substring(0, 1500)}
\`\`\`
=================================
*Segera cek Termux lu sebelum mesin meledak!*`);
            }
        } catch (err) {
            console.error('Gagal ngirim laporan error ke Discord:', err);
        }
    }
};

module.exports = { reportError };
