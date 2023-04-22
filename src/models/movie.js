const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    language : {
        type: String,
        required: true,
    },
    length: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    release_date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
});

const movie = mongoose.model('movie', MovieSchema);

module.exports = movie;
