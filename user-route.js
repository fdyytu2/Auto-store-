// API buat nampilin profil lu
app.get('/api/me', (req, res) => {
  if (req.user) {
    // Kalau udah login, kirim namanya
    res.json({ username: req.user.global_name || req.user.username });
  } else {
    res.status(401).json({ error: "Belum login" });
  }
});
