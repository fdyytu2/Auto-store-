const fs = require('fs');

// Baca semua file di folder models
const files = fs.readdirSync('models');

// Cari file yang namanya mirip 'user.js' mengabaikan huruf besar/kecil
const targetFile = files.find(file => file.toLowerCase() === 'user.js');

if (!targetFile) {
    console.log("❌ File cetakan user gak ketemu sama sekali di folder models!");
    process.exit(1);
}

const filePath = `models/${targetFile}`;
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('avatar:')) {
    // Cari bagian 'role:' lalu selipin 'avatar:' di atasnya
    content = content.replace(
        /role:\s*\{/g,
        "avatar: { type: DataTypes.STRING, allowNull: true },\n    role: {"
    );
    fs.writeFileSync(filePath, content);
    console.log(`✅ Laci 'avatar' berhasil ditambahkan ke ${targetFile}!`);
} else {
    console.log(`⚠️ Laci 'avatar' udah ada di ${targetFile} Bos.`);
}
