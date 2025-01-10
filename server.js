const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const transactionRouter = require('./controllers/transactions');
const adminsRouter = require('./controllers/admins');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/transactions', transactionRouter);
app.use('/admin', adminsRouter);


app.listen(port, () => console.log(`Express is running on port ${port}`));
