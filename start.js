const { spawn } = require('child_process');

console.log('🚀 Memulai Engine Auto Store (Bot + Dashboard)...\n');

// URL Webhook lu udah di-injek langsung ke sini
const webhookUrl = process.env.DISCORD_WEBHOOK || 'https://discord.com/api/webhooks/1489510508825673868/5_O7jh6mOV8jsDD7HA5GB5IdexzKUineQh6iwEDxrLmOEXjrDBBIr6FJFWyPnZqJaxL_';

async function sendErrorToDiscord(message, source) {
    if (!webhookUrl) return;
    try {
        const cleanMsg = message.length > 1900 ? message.substring(0, 1900) + '\n...[TERPOTONG]' : message;
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `🚨 **[ERROR DARI ${source}]**\n\`\`\`js\n${cleanMsg}\n\`\`\``
            })
        });
    } catch (e) {
        // Abaikan kalau gagal
    }
}

const webServer = spawn('node', ['server.js']);
const discordBot = spawn('node', ['index.js']);

webServer.stdout.on('data', (data) => process.stdout.write(`[WEB] ${data}`));
discordBot.stdout.on('data', (data) => process.stdout.write(`[BOT] ${data}`));

webServer.stderr.on('data', (data) => {
    const err = data.toString();
    process.stderr.write(`[WEB ERROR] ${err}`);
    sendErrorToDiscord(err, 'DASHBOARD');
});

discordBot.stderr.on('data', (data) => {
    const err = data.toString();
    process.stderr.write(`[BOT ERROR] ${err}`);
    sendErrorToDiscord(err, 'ENGINE BOT');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Mematikan semua proses...');
    webServer.kill();
    discordBot.kill();
    process.exit();
});
