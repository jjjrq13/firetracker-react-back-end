const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {

        const userInDatabase = User.findOne({
            username: req.body.username.toLowerCase(),
        });

        console.log(req.body.username.toLowerCase())

        if (userInDatabase) {
            return res.json({ error: 'Username unavailable!' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.json({ error: 'Passwords do not match' });
        }

        const userData = {};

        if (!userInDatabase && req.body.password === req.body.confirmPassword) {
            userData = { ...req.body };

            delete userData.password;
            delete userData.confirmPassword;
            delete userData.username;

            userData.password = bcrypt.hashSync(req.body.password, SALT_LENGTH);
            userData.username = req.body.username.toLowerCase();
        }

        const user = await User.create(userData);
        const token = jwt.sign(
            { username: user.username, _id: user._id },
            process.env.JWT_SECRET,
        );

        res.status(201).json({ user, token });

    } catch {
        res.status(400).json({ error: 'Sign up not working' });

    }
});

router.post('/signin', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        const token = jwt.sign(
          { username: user.username, _id: user._id },
          process.env.JWT_SECRET
        );

        res.status(200).json({ token });

      } else {
        res.status(401).json({ error: 'Invalid username or password.' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Sign in not working' });
    }
});

module.exports = router;
