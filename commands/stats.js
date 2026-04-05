const os = require('os');
const db = require('../models');

module.exports = {
    name: 'stats',
    description: 'Ngecek jeroan mesin dan database Kora',
    async execute(message, args) {
        try {
            // Cuma Sultan (Admin) yang boleh buka kap mesin
            const user = await db.User.findOne({ where: { discordId: message.author.id } });
            if (!user || user.role !== 'admin') {
                return message.reply('❌ Lu bukan mekanik Kora, dilarang ngintip jeroan mesin!');
            }

            // Hitung detak jantung hardware (Ubah byte jadi Megabyte)
            const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
            const freeRam = (os.freemem() / 1024 / 1024).toFixed(2);
            const usedRam = (totalRam - freeRam).toFixed(2);
            
            // Hitung RAM yang murni cuma dipake sama Kora
            const nodeMemory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
            
            // Cek isi gudang (Database)
            const totalUsers = await db.User.count();
            
            // Hitung berapa lama Kora melek (Uptime)
            const uptime = process.uptime(); 
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);

            const report = `🤖 **STATUS MESIN KORA ENGINE** 🤖
=================================
💻 **OS Server** : ${os.type()} ${os.arch()}
🧠 **RAM Railway** : ${usedRam} MB / ${totalRam} MB
⚙️ **Beban Kora** : ${nodeMemory} MB
⏱️ **Uptime Bot** : ${hours} Jam, ${minutes} Menit
🗄️ **Kapasitas DB**: ${totalUsers} Akun Terdaftar
=================================`;

            message.reply(`\`\`\`text\n${report}\n\`\`\``);

        } catch (error) {
            console.error(error);
            message.reply('Sistem sensor lagi korslet Bos!');
        }
    }
};
