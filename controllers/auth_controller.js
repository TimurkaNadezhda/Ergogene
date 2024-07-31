const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');

const findUserByMail = async (email) => User.findOne({ email });
const signUser = async ( req, res) => {
    // Hashage du mot de passe grâce à la méthode hash du package bcrypt
    const hash = await bcrypt.hash(req.body.password, 10);
    
    // Création d'un nouvel utilisateur (new User) avec les données du formulaire (req.body)
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        fullaccess : req.body.fullaccess
    });

    /* Sauvegarde des données du nouvel utilisateur dans la base de données grâce à la méthode .save de mongoose */
    user.save().then(result => {
        // Je crée mes variable de session (userConnected => message accueil, isConnected => navigation header dynamique)
        req.session.userConnected = `Bienvenue ${result.lastname} ${result.firstname}.`
        req.session.isConnected = true;
        req.session.isAdmin = (result.fullaccess == 'admin' || result.fullaccess == 'superadmin');
        req.session.isSuperAdmin = result.fullaccess == 'superadmin';
        
        const token = jwt.sign(
            { userId: result._id},
            process.env.SECRET_KEY_TOKEN,
            { expiresIn: '7d'}
        );

        // Je crée mon cookie, en lui définissant un nom, en lui donnant son contenu (le token crée juste au dessus), puis je définis ses options
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 604800000
        });
        
        res.status(200).redirect('/');
    }).catch(error => {
        res.status(500).json({error: error})
    })
}

function displayLoginPage(req, res) {
    res.status(200).render(path.join(__dirname, `../views/auth/signin.ejs`));
};

function signIn(req, res) {
    const user = req.user;
    if (!user) {
        res.redirect('/signin');
    }

    req.session.userConnected = `Bienvenue ${user.lastname} ${user.firstname}`;
    req.session.isConnected = true;
    req.session.userId = user._id;
    req.session.isAdmin = (user.fullaccess == 'superadmin' || user.fullaccess == 'admin');
    req.session.isSuperAdmin = user.fullaccess == 'superadmin';
                
    // Je crée mon token d'authentification grâce à JsonWebToken, en lui définissant un id utilisateur, une clé de décryptage, et la durée d'existance du token
    const token = jwt.sign(
        { userId: user._id},
        process.env.SECRET_KEY_TOKEN,
        { expiresIn: '7d'}
    );

    // Je crée mon cookie, en lui définissant un nom, en lui donnant son contenu (le token crée juste au dessus), puis je définis ses options
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000 // millisecondes
    });
                
    res.status(200).redirect('/admin');
}

function displayLogoutPage(req, res) {
    res.status(200).render(path.join(__dirname, `../views/auth/logout.ejs`));
};

// Middleware de validation de formulaire de déconnexion
async function logout(req, res) {
    try{
        // Je nettoies tous les cookies qui ont été créés avec la méthode clearCookie
        res.clearCookie('token');

        // Je supprime toutes les variables de session qui ont été créé en détruisant la session avec la méthode destroy
        req.session.destroy();

        res.redirect('/');
    } catch(error) {
        res.status(500).send('Erreur Inscription Try ' + error.message)
    }
}

module.exports = {
    displayLoginPage,
    signIn,
    displayLogoutPage,
    logout,
};
