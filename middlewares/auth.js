module.exports = {
    cekLoginAPI: (req, res, next) => {
        if (req.session.loggedIn) next();
        else res.status(401).json({ success: false, message: 'Akses ditolak! Belum login.' });
    },
    cekLoginWeb: (req, res, next) => {
        if (req.session.loggedIn) next();
        else res.redirect('/login.html');
    }
};
