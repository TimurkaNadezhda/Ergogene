const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    lastname: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    fullaccess: { type: String, enum:['superadmin', 'admin', 'user'], required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema, 'users');