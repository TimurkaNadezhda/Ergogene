const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const mailSchema = mongoose.Schema({
    lastname: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    jobTitle: { type: String, trim: true },
    tel: { type: String, trim: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
}, { timestamps: true }); 

mailSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Mail', mailSchema, 'mails');
