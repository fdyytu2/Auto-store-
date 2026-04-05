const fs = require('fs');
let content = fs.readFileSync('models/user.js', 'utf8');

// Kita cek apakah kolom avatar udah ada
if (!content.includes('avatar:')) {
    // Cari bagian 'role:' lalu selipin 'avatar:' di atasnya
    content = content.replace(
        /role:\s*\{/g,
        "avatar: { type: DataTypes.STRING, allowNull: true },\n    role: {"
    );
    fs.writeFileSync('models/user.js', content);
    console.log("✅ Laci 'avatar' berhasil ditambahkan ke tabel User!");
} else {
    console.log("⚠️ Laci 'avatar' udah ada Bos.");
}
