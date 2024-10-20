import mongoose from 'mongoose';

const TerminalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    instrument: {
        type: String,
        default: 'BTCUSDT', // Default instrument
        required: true
    },
    watchlist: [{
        symbol: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now // Timestamp of when it was added
        }
    }],
    calendar: [{
        event: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }],
    screenshot: {
        type: String,
        required: false // URL or path to the screenshot image
    },
    alert: [{
        message: {
            type: String,
            required: true
        },
        triggeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    chartDownload: [{
        type: String, // URL or path to downloaded charts
    }],
    replay: [{
        type: String, // URL or path to replay data
    }],
    news: [{
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    orderPanel: {
        type: Object, // You can define a specific schema for orders if needed
        required: false
    },
    tradePanel: {
        type: Object, // You can define a specific schema for trades if needed
        required: false
    }
}, {
    timestamps: true, // Automatically create createdAt and updatedAt fields
});

export default mongoose.model('Terminal', TerminalSchema);
