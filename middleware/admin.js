
function admin (req, res, next) {

    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log(req.user,'my user');
        console.log(req.user.isAdmin,'is admin');
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
}

module.exports = admin;



// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid authorization token.' });
//     }
// }
