const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Cek apakah rute admin udah ada atau belum
if (!content.includes("/api/admin")) {
    // Cari baris rute user, lalu selipin rute admin di bawahnya
    content = content.replace(
        "app.use('/api/user', require('./routes/user'));", 
        "app.use('/api/user', require('./routes/user'));\napp.use('/api/admin', require('./routes/admin'));"
    );
    fs.writeFileSync('server.js', content);
    console.log("✅ Rute Admin berhasil didaftarkan di server.js!");
} else {
    console.log("⚠️ Rute Admin udah ada di server.js.");
}
