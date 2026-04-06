const fs = require('fs');
let content = fs.readFileSync('./server.js', 'utf8');

if (content.includes("const { BotConfig } = require('./db');")) {
    content = content.replace(
        "const { BotConfig } = require('./db');",
        "const { BotConfig } = require('./models');"
    );
    fs.writeFileSync('./server.js', content);
    console.log("✅ server.js sekarang ngambil database dari tempat yang benar!");
}
