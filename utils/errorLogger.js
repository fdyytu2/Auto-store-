// Baca URL dari WEBHOOK_ERROR_URL atau DISCORD_WEBHOOK (jaga-jaga kalau lu pakai nama lama)
const WEBHOOK_URL = process.env.WEBHOOK_ERROR_URL || process.env.DISCORD_WEBHOOK; 

module.exports = {
    catatError: async (errorMsg) => {
        // Kalau webhook belum di-set di Railway, tampilin di terminal aja biar gak crash
        if (!WEBHOOK_URL) {
            console.error("🚨 ERROR LOG:", errorMsg);
            return; 
        }
        
        const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        
        // Potong pesan kalau kepanjangan biar Discord gak nolak (Limit 2000 karakter)
        const cleanMsg = typeof errorMsg === 'string' && errorMsg.length > 1900 
            ? errorMsg.substring(0, 1900) + '\n...[TERPOTONG]' 
            : errorMsg;

        const formatPesan = `**🚨 SERVER ALARM**\n\`\`\`js\n[${waktu}]\n${cleanMsg}\n\`\`\``;
        
        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formatPesan })
            });
        } catch (err) {
            console.error("Gagal ngirim error ke Webhook:", err.message);
        }
    }
};
