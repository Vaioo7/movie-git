const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    seat: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const booking = mongoose.model('booking', BookingSchema);

module.exports = booking;
