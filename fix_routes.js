const fs = require('fs');
let content = fs.readFileSync('./bot-routes.js', 'utf8');

// 1. Fix Typo Event Ready
if (content.includes("client.once('clientReady',")) {
    content = content.replace("client.once('clientReady',", "client.once('ready',");
    console.log("✅ Typo 'clientReady' berhasil diperbaiki menjadi 'ready'!");
}

// 2. Fix Intents (Tambahin MessageContent & DirectMessages)
const oldIntents = `client = new Client({ intents: [GatewayIntentBits.Guilds] });`;
const newIntents = `const { Partials } = require('discord.js');
    client = new Client({ 
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [Partials.Channel, Partials.Message]
    });

    // Panggil otak perintah dari botManager biar dia gak bego
    const { startCustomBot } = require('./utils/botManager');
    startCustomBot(token, process.env.OWNER_ID); // Lempar ke mesin pintar
`;

if (content.includes(oldIntents)) {
    content = content.replace(oldIntents, newIntents);
    console.log("✅ Intents dan botManager berhasil dipasang ke Master Bot!");
}

fs.writeFileSync('./bot-routes.js', content);
