const db = require('./models');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

async function startBot() {
    try {
        console.log('⏳ Memeriksa pengaturan dari Database...');
        
        // Cari pengaturan ID 1
        let setting = await db.Setting.findByPk(1);
        
        // Kalau database kosong, buatin default-nya otomatis!
        if (!setting) {
            console.log('⚠️ Data pengaturan belum ada. Membuat default pengaturan...');
            setting = await db.Setting.create({
                id: 1,
                botToken: process.env.TOKEN || '', // Ambil dari Railway kalau ada, kalau gak kosongin
                maintenanceMode: false
            });
        }

        // Kalau tokennya benar-benar kosong
        if (!setting.botToken || setting.botToken === '') {
            console.log('🛑 BOT KOSONG: Token belum diisi! Silakan isi Token lewat Dashboard Super Admin.');
            // Biarkan nyala, tapi bot Discord gak login
            return; 
        }

        console.log('🟢 Token ditemukan! Menghidupkan Bot Utama...');
        await client.login(setting.botToken);
        console.log('🚀 Bot Utama Berhasil Online!');

    } catch (error) {
        console.error('❌ Error saat memulai bot:', error.message);
    }
}

// Jalankan fungsi
startBot();
