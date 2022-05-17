const mongoose = require('mongoose');

const model = mongoose.model('Transaction', {
    transactionAmount: {
        type: Number,
        required: true
    },
    dateOfTransaction: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    scratchCardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScratchCard'
    }
});

module.exports = model;
