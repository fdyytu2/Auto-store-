const fs = require('fs');
let content = fs.readFileSync('routes/admin.js', 'utf8');

// Suntik paksa pengenalan BotConfig tanpa lewat index.js
if (!content.includes('db.BotConfig = require')) {
    content = content.replace(
        "const db = require('../models');",
        "const db = require('../models');\nconst { DataTypes } = require('sequelize');\nif (!db.BotConfig) db.BotConfig = require('../models/botconfig')(db.sequelize, DataTypes);"
    );
    fs.writeFileSync('routes/admin.js', content);
    console.log("✅ Bypass database sukses disuntik ke admin.js!");
} else {
    console.log("⚠️ Bypass udah ada bre.");
}
