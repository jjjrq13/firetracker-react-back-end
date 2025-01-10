const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');
const admin = require('../middleware/admin');

router.use(verifyToken);
router.use(admin);

router.get('/users', async (req, res) => {
    try {

        console.log('we were')

        const users = await User.find({});

        res.status(200).json(users);
    } catch(error) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
});

router.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        await Transactions.deleteMany({ userId });

        await User.findByIdAndDelete(userId);

        res.status(200).json({message: `User ${userId} is 86!`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;