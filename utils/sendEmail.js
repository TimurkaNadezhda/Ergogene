const nodemailer = require('nodemailer');
require('dotenv').config(); 
const Mail = require('../models/Mail');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

function sendEmail(mailData) {

    transporter.sendMail(mailData, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
