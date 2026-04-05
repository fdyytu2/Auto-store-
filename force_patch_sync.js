const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita cari bagian sync, mau ada spasi atau .then, kita paksa selipin alter: true
if (content.includes('db.sequelize.sync')) {
    // Regex sakti buat nyari sync() atau sync({}) dan ganti jadi sync({ alter: true })
    content = content.replace(/db\.sequelize\.sync\s*\(\s*\{?.*?\}?\s*\)/g, 'db.sequelize.sync({ alter: true })');
    
    fs.writeFileSync('server.js', content);
    console.log("✅ Selesai! server.js sekarang punya kekuatan buat benerin kolom database.");
} else {
    console.log("❌ Waduh, kata 'db.sequelize.sync' gak ada di server.js. Coba 'cat server.js' buat gua liat!");
}
