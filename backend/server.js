const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import models
const Income = require('./models/Income');
const Expense = require.require('./models/Expense');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Adjust origin to your React app's URL (e.g., http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // To parse JSON bodies

// --- Database Connection ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};
connectDB();

// Function to handle saving data for both Income and Expense
const saveTransaction = async (Model, req, res) => {
    try {
        // Mongoose automatically validates the data against the Schema before saving
        const newTransaction = await Model.create(req.body);

        res.status(201).json({
            success: true,
            data: newTransaction
        });

    } catch (err) {
        console.error('Validation/Server Error:', err);

        // Handle Mongoose Validation Errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        
        res.status(500).json({ success: false, error: 'Server Error occurred while saving transaction.' });
    }
};


// --- API Endpoints ---

// POST Route to Record NEW INCOME
app.post('/api/income', (req, res) => saveTransaction(Income, req, res));

// GET Route to Fetch ALL INCOME
app.get('/api/income', async (req, res) => {
    try {
        const incomeRecords = await Income.find().sort({ date: -1 }); // Sort by date descending
        res.status(200).json({ success: true, count: incomeRecords.length, data: incomeRecords });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error fetching income.' });
    }
});

// POST Route to Record NEW EXPENSE
app.post('/api/expense', (req, res) => saveTransaction(Expense, req, res));

// GET Route to Fetch ALL EXPENSE
app.get('/api/expense', async (req, res) => {
    try {
        const expenseRecords = await Expense.find().sort({ date: -1 }); // Sort by date descending
        res.status(200).json({ success: true, count: expenseRecords.length, data: expenseRecords });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error fetching expense.' });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});