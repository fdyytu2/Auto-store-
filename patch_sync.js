const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita ganti baris sync yang lama jadi versi 'alter: true'
if (content.includes('db.sequelize.sync()')) {
    content = content.replace(
        'db.sequelize.sync()',
        'db.sequelize.sync({ alter: true })'
    );
    fs.writeFileSync('server.js', content);
    console.log("✅ server.js sudah dipersenjatai buat benerin database!");
} else {
    console.log("⚠️ Baris sync gak ketemu, coba cek manual server.js lu.");
}
