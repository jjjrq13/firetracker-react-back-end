const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        description: {
            type: String,
            maxlength: 100,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['Income', 'Expense'],
            required: true,
        },
        category: {
            type: String,
            enum: [
                'Income',
                'Needs',
                'Wants',
                'Culture',
                'Unexpected',
                'Saved',
                'Transfer',
            ],
            required: true,
        },
        notes: {
            type: String,
            maxlength: 250,
        },
    },
    { timestamps: true },
);

transactionSchema.pre('save', async function () {
    this.amount = Math.round(this.amount * 100) / 100;

    this.date = this.date.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        },
    );

    if (this.type === 'Expense' && this.amount > 0) {
        this.amount = this.amount * -1;
    }
});

const Transaction = mongoose.model('Transactions', transactionSchema);

module.exports = Transaction;
