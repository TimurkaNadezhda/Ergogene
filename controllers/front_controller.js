const path = require('path');
const Post = require("../models/Post");
const Mail = require('../models/Mail');
const sendEmail = require('../utils/sendEmail');

function displayHomePage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/home.ejs'));
}

async function displayBlogPage (_, res) {
    try {
        const posts = await Post.find({ status: true });

        res.status(200).render(
            path.join(__dirname, '../views/blog.ejs'),
            { posts }
        );
    } catch (error) {
        console.error(error)
        res.status(500).render(
            path.join(__dirname, '../views/error.ejs'),
            { error }
        );
    } 
}

function displayContactsPage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/contact.ejs'));
}

async function handleContactsForm(req, res) {
    try {
        // Создание объекта Mail на основе данных из запроса
        const toMail = process.env.EMAIL_USER;
        const { lastname, firstname, jobTitle, tel, email, subject, message } = req.body;
        const mailData = new Mail({ 
            lastname: lastname, 
            firstname: firstname, 
            jobTitle: jobTitle, 
            tel: tel, 
            from: email, 
            to: toMail, 
            subject: subject, 
            message: message 
        });

        // Сохранение данных в базе данных
        await mailData.save();

        // Отправка электронной почты
        const mailSend = {
            from: email,
            to: toMail,
            subject: subject,
            text: `Prénom: ${firstname}\n` +
                  `Nom: ${lastname}\n` +
                  `Fonction: ${jobTitle}\n` +
                  `Téléphone: ${tel}\n` +
                  `Email: ${email}\n` +
                  `Sujet: ${subject}\n` +
                  `Message: ${message}` 
        };
        await sendEmail(mailSend);

        req.session.message = 'Email sent successfully!'
        res.redirect('/contact');
    } catch (error) {
        
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email' });
    }
}

function displayPresentationsPage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/prestations.ejs'));
}

function displayFormationsPage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/formations.ejs'));
}

function displayMentionsPage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/mentions.ejs'));
}

function displayConfidentialityPage(_, res) {
    res.status(200).render(path.join(__dirname, '../views/confidentiality.ejs'));
}

module.exports = {
    displayHomePage,
    displayBlogPage,
    displayContactsPage,
    handleContactsForm,
    displayPresentationsPage,
    displayFormationsPage,
    displayMentionsPage,
    displayConfidentialityPage,
};
