const mongoose = require('mongoose');

const model = mongoose.model('ScratchCard', {
    discountAmount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isScratched: {
        type: Boolean
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    }
});

module.exports = model;
