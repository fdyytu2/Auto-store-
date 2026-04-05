const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita ganti settingan CORS biar lebih longgar buat ngetes
content = content.replace(/origin: \[.*?\],/g, "origin: true,");

fs.writeFileSync('server.js', content);
console.log("✅ Backend sekarang nerima koneksi dari mana aja (CORS Fix)!");
