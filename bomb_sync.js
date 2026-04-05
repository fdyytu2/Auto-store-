const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita ganti sync lama jadi FORCE TRUE buat ngebom tabel yang salah
if (content.includes('db.sequelize.sync')) {
    // Cari bagian sync dan ganti jadi force: true
    content = content.replace(/db\.sequelize\.sync\s*\(\s*\{?.*?\}?\s*\)/g, 'db.sequelize.sync({ force: true })');
    
    fs.writeFileSync('server.js', content);
    console.log("✅ BOM ATOM TERPASANG! Railway bakal reset tabel database.");
} else {
    console.log("❌ Baris sync gak ketemu bre.");
}
