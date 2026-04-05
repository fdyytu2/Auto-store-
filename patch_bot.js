const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

if (!content.includes("global.mainBot")) {
    const botSetup = `

// ==========================================
// 2. MESIN DISCORD MASTER ENGINE
// ==========================================
global.mainBot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

global.mainBot.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(\`./commands/\${file}\`);
    global.mainBot.commands.set(command.name, command);
}

global.mainBot.on('ready', () => {
    console.log(\`✅ Kora Master Engine Online sebagai \${global.mainBot.user.tag}!\`);
});

global.mainBot.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!global.mainBot.commands.has(commandName)) return;

    try {
        await global.mainBot.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error('Error saat eksekusi command:', error);
        message.reply('Aduh Bos, ada kabel yang putus di mesin Kora!');
    }
});
`;
    fs.appendFileSync('server.js', botSetup);
    console.log("✅ Mesin Discord sukses ditanam di server.js!");
} else {
    console.log("⚠️ Mesin Discord udah ada di server.js.");
}
