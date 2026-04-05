const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita suntik perintah khusus buat nge-reset tabel Setting aja
if (!content.includes('db.Setting.sync({ force: true })')) {
    const bomMini = `
    // BOM MINI: Bikin ulang tabel Setting dari nol biar kolomnya lengkap
    if (db.Setting) {
        db.Setting.sync({ force: true }).then(() => console.log('💣 Tabel Setting berhasil di-reset bersih!'));
    }
`;
    // Selipin tepat setelah database utama siap
    content = content.replace("console.log('✅ Database siap!');", "console.log('✅ Database siap!');" + bomMini);
    
    fs.writeFileSync('server.js', content);
    console.log("✅ Bom Mini khusus Tabel Setting berhasil dipasang!");
} else {
    console.log("⚠️ Bom Mini udah kepasang bre.");
}
