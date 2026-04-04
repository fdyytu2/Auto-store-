const fs = require('fs');
const path = require('path');

module.exports = {
    // Fungsi buat ngitung baris TXT (1 baris = 1 stock)
    hitungStock: (userId, namaProduk) => {
        // Path spesifik buat tiap penyewa: data/stocks/ID_Discord/NamaProduk.txt
        const filePath = path.join(__dirname, `../data/stocks/${userId}/${namaProduk}.txt`);
        
        // Kalau filenya belum dibikin, anggep stock kosong (0)
        if (!fs.existsSync(filePath)) return 0;
        
        const isi = fs.readFileSync(filePath, 'utf-8');
        // Pisahin enter, buang baris kosong, hitung jumlahnya
        return isi.split('\n').filter(line => line.trim() !== '').length;
    }
};
