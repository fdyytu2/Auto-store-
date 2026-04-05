app.use((err, req, res, next) => {
  if (err && err.name === 'TokenError') {
    console.log("⚠️ [WARN] Kode Discord hangus/expired. Redirect ke Home...");
    return res.redirect('http://localhost:5173');
  }
  next(err);
});
