const fs = require('fs');
let content = fs.readFileSync('routes/admin.js', 'utf8');

// Ganti semua referensi tabel Setting jadi BotConfig
content = content.replace(/db\.Setting/g, 'db.BotConfig');

fs.writeFileSync('routes/admin.js', content);
console.log("✅ Backend sekarang pakai tabel BotConfig yang baru!");
