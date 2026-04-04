const db = require('../models');
const errorLogger = require('./errorLogger');

const syncDatabase = async (retries = 5, delay = 5000) => {
    // Otomatis baca saklar dari Railway, defaultnya 'alter' (Aman)
    const mode = process.env.SYNC_MODE || 'alter'; 
    
    while (retries > 0) {
        try {
            if (mode === 'force') {
                console.log("⚠️ MODE BAHAYA AKTIF: Meratakan database (Force: true)");
                await db.sequelize.sync({ force: true });
                
                // Bot otomatis lapor ke Discord lu
                errorLogger.catatError("⚠️ **PERINGATAN!** Database baru saja di-reset total (Force Sync). Segera hapus variabel SYNC_MODE di Railway agar data tidak hilang saat server restart!");
            } else {
                console.log("🔄 MODE AMAN: Sinkronisasi tabel (Alter: true)");
                await db.sequelize.sync({ alter: true });
            }
            
            console.log("✅ Database berhasil disinkronisasi dengan lancar!");
            return; // Sukses, keluar dari perulangan
        } catch (err) {
            console.error("Gagal sync DB, mencoba lagi dalam 5 detik...");
            retries -= 1;
            
            if (retries === 0) {
                errorLogger.catatError(`🚨 Gagal sync DB permanen setelah 5 kali coba:\n${err.message}`);
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

module.exports = syncDatabase;
