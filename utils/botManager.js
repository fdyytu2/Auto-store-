const { Client, GatewayIntentBits } = require('discord.js');

// Brankas sementara buat nyimpen bot yang lagi nyala di memori server
const activeBots = new Map();

module.exports = {
    // Fungsi buat nyalain bot penyewa
    startBot: async (botId, token) => {
        if (activeBots.has(botId)) {
            console.log(`Bot ${botId} udah nyala, bre.`);
            return true;
        }
        
        try {
            const client = new Client({
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
            });

            client.once('ready', () => {
                console.log(`🚀 Custom Bot [${client.user.tag}] berhasil online!`);
            });

            // Respon dasar bot penyewa
            client.on('messageCreate', (message) => {
                if (message.author.bot) return;
                
                // Nanti logika PPOB/AI ditaruh di sini
                if (message.content === '!ping') {
                    message.reply('Pong! Bot PPOB lu udah nyala bos! 🗿');
                }
            });

            await client.login(token);
            activeBots.set(botId, client); // Masukin ke brankas
            return true;
        } catch (err) {
            console.error(`🚨 Gagal nyalain bot ${botId}:`, err.message);
            return false;
        }
    },

    // Fungsi buat matiin bot penyewa (misal masa sewanya abis)
    stopBot: (botId) => {
        if (activeBots.has(botId)) {
            const client = activeBots.get(botId);
            client.destroy(); // Putus koneksi dari Discord
            activeBots.delete(botId); // Keluarin dari brankas
            console.log(`🛑 Bot ${botId} udah dimatiin.`);
            return true;
        }
        return false;
    }
};
