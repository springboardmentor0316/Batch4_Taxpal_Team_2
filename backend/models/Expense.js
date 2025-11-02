const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be a positive value']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        // Matching your frontend expense categories
        enum: ['Food', 'Rent/Mortgage', 'Utilities', 'Transportation', 'Shopping', 'Other'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters'],
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);