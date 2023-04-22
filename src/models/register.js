const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RegisterSchema = new mongoose.Schema({
    role: {
        type: String,
        default: "user",
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        public_id: {
            type: String,
            default: "public_id",
        },
        url: {
            type: String,
            default: "url",
        },
    },
    gender: {
        type: String,
        default: 'male'
    },
    DOB: {
        type: String,
        default: '01-01-2000'
    }
});

RegisterSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
RegisterSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

RegisterSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const register = mongoose.model('register', RegisterSchema);

module.exports = register;
