const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const db = require('./models'); // Tarik database ORM

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]
});

client.commands = new Collection();

// Memuat Event Handler otomatis
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, db));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client, db));
    }
}

// Memuat Command Handler otomatis
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// Start Bot Logic
async function startBot() {
    setTimeout(async () => {
        try {
            // Ambil token dari database
            const tokenData = await db.Setting.findByPk('main_bot_token');
            if (!tokenData || !tokenData.value) {
                console.log('⚠️ Token bot utama belum disetting. Silakan login ke Dashboard untuk mengisi token.');
                return;
            }
            client.login(tokenData.value).catch(err => console.error('❌ Gagal login bot:', err.message));
        } catch (error) {
            console.error('❌ Error saat memulai bot:', error);
        }
    }, 2500); // Kasih jeda biar SQLite selesai sinkronisasi tabel
}

startBot();
