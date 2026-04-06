const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const db = require('../models');

// Tempat nyimpen semua bot yang lagi jalan
const runningBots = new Map();

async function startCustomBot(token, ownerId) {
    if (runningBots.has(ownerId)) {
        console.log(`⚠️ Bot untuk owner ${ownerId} sudah jalan.`);
        return true;
    }

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    client.commands = new Collection();
    client.ownerId = ownerId; // 🔥 INI KUNCI SAKTINYA: Bot pegang ID Pemilik!

    // Load Commands
    const commandPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${commandPath}/${file}`);
        client.commands.set(command.name, command);
    }

    // Event: Bot Ready
    client.once('ready', () => {
        console.log(`✅ Bot Toko Aktif: ${client.user.tag} (Owner: ${ownerId})`);
    });

    // Event: Pesan Masuk
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.content.startsWith('!')) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        
    // 🔥 EVENT BARU: Penangkap Tombol & Modal Pop-up
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            const { handleButton } = require('../interactions/buttonHandler');
            await handleButton(interaction, client, db);
        } else if (interaction.isModalSubmit()) {
            const { handleModal } = require('../interactions/modalHandler');
            await handleModal(interaction, client, db);
        }
    });

    try {
            // Jalankan command dengan melempar db dan ownerId
            await command.execute(message, args, client, db);
        } catch (error) {
            console.error(error);
            message.reply('❌ Terjadi kesalahan saat menjalankan perintah.');
        }
    });

    try {
        await client.login(token);
        runningBots.set(ownerId, client);
        return true;
    } catch (err) {
        console.error(`❌ Gagal login bot owner ${ownerId}:`, err.message);
        return false;
    }
}

module.exports = { startCustomBot, runningBots };
