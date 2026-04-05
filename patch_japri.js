const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Tambahin Partials ke import discord.js kalau belum ada
if (!content.includes('Partials')) {
    content = content.replace('GatewayIntentBits', 'GatewayIntentBits, Partials');
}

// Tambahin partials Channel dan Intent DirectMessages ke konfigurasi Client
if (!content.includes('Partials.Channel')) {
    content = content.replace(
        'intents: [',
        'partials: [Partials.Channel],\n    intents: ['
    );
    content = content.replace(
        'GatewayIntentBits.MessageContent',
        'GatewayIntentBits.MessageContent,\n        GatewayIntentBits.DirectMessages'
    );
    fs.writeFileSync('server.js', content);
    console.log("✅ Izin Japri (DM) berhasil ditanam ke otak Kora!");
} else {
    console.log("⚠️ Izin Japri udah ada, aman Bos.");
}
