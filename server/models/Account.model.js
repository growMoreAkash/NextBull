import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Real', 'Demo'], // Account type can be 'Real' or 'Demo'
        required: true,
    },
    balance: {
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            enum: [
                'USD', // United States Dollar
                'EUR', // Euro
                'JPY', // Japanese Yen
                'GBP', // British Pound Sterling
                'AUD', // Australian Dollar
                'CAD', // Canadian Dollar
                'CHF', // Swiss Franc
                'CNY', // Chinese Yuan
                'NZD', // New Zealand Dollar
                'INR', 
            ],
            required: true,
            default: 'USD', // Default currency is USD
        },
    },
}, {
    timestamps: true,
});

export default mongoose.model('Account', AccountSchema);
