const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true, unique: true},
    subtitle: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    status: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema, 'posts')
