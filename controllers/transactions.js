const express = require('express');
const router = express.Router();
const Transactions = require('../models/transaction');
const verifyToken = require('../middleware/verify-token');
const admin = require('../middleware/admin');
const User = require('../models/user');


router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transactions.find({ userId }).sort({ date: -1 });

        let income = 0;
        let expenses = 0;

        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].type === 'Income'){
                income = income + transactions[i].amount
            } else {
                expenses = expenses + transactions[i].amount
            }
        }

        res.status(200).json({
            transactions,
            balance: income - expenses,
            totalIncome: income,
            totalExpenses: expenses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {

      req.body.author = req.user._id;

      const transaction = await Transactions.create(req.body);

      res.status(201).json(transaction);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transactions.findOne({
            _id: req.params.transactionId,
            userId: req.user._id,
        });

        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transactions.findOneAndUpdate(
            { _id: req.params.transactionId, userId: req.user._id }, req.body)

        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:transactionId', verifyToken, async (req, res) => {
    try {
        const transaction = await Transactions.findOneAndDelete({
            _id: req.params.transactionId,
            userId: req.user._id,
        });

        res.status(200).json({ message: 'Ok' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

router.use(admin);

router.get('/admin/users', async (req, res) => {
    try {

        const users = await User.find({});

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/admin/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user86 = await User.findByIdAndDelete(userId);

        res.status(200).json(user86);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;