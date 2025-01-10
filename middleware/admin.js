const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized User' });
    }
}

module.exports = admin;