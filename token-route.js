// API buat ambil token yang udah ada
app.get('/api/token-master', async (req, res) => {
  try {
    // Di sini nanti lu ganti pake query database beneran (Sequelize/PG)
    // Untuk sekarang kita balikin data placeholder
    res.json({ token: "MTIzNDU2Nzg5..." }); 
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil token" });
  }
});

// API buat simpen token baru
app.post('/api/token-master', express.json(), async (req, res) => {
  const { token } = req.body;
  console.log("💾 [DB] Token Master baru disimpan:", token);
  // Di sini nanti proses INSERT ke database Railway lu
  res.json({ message: "Token berhasil disimpan ke database!" });
});
