module.exports = {
    cekLogin: (req, res, next) => {
        // Cek apakah user sudah punya sesi login
        if (req.session && req.session.user) {
            return next(); // Punya tiket? Silakan lewat!
        }
        // Gak punya tiket? Kasih error 401 atau tendang ke login
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Belum login bro!' });
        }
        res.redirect('/login.html');
    }
};
