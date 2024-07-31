const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcrypt');

async function displayUsersPage(_, res) {
    try {
        const users = await User.find();

        res.status(200).render(path.join(__dirname, '../views/management/users/list-users.ejs'), { users });
    } catch (e) {
        res.status(500).render(path.join(__dirname, '../views/error.ejs'), {
            code: '500',
            message: e.message,
        });
    }  
}

function displayUserDetailsPage(req, res) {
    const detailsUser = req.userDetails;

    res.status(200).render(
        path.join(__dirname, '../views/management/users/detail-user.ejs'),
        { detailsUser },
    );
}

function displayCreateUserPage(_, res) {
    res.status(200).render(
        path.join(__dirname, '../views/management/users/create-user.ejs'));
}

async function createUser(req, res) {
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
    try {
        const result = await user.save();

        req.session.message = `Utilisateur ${result.lastname} ${result.firstname} créé avec succès.`
        res.redirect('/users');
    } catch(error) {
        req.session.errors = [error.message];
        req.session.formData = req.body;
        res.redirect('/users/create');
    }   
}

async function displayUserUpdatePage(req, res) {
    const detailsUser = req.userDetails;

    if (!detailsUser) {
        res.render(path.join(__dirname, '../views/error.ejs'));
    }

    res.status(200).render(
        path.join(__dirname, '../views/management/users/update-user.ejs'),
        { detailsUser },
    );
};

async function updateUser(req, res) {
    const updatedUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        fullaccess : req.body.fullaccess
    }
    
    try {
        await User.updateOne({ _id: req.params.id }, { ...updatedUser });

        req.session.message = `Utilisateur ${updatedUser.lastname} ${updatedUser.firstname} mis à jour avec succès.`;
        res.redirect(`/users`);
    } catch(error) {
        req.session.errors = [error.message];
        req.session.formData = req.body;
        
        res.redirect(`/users/${req.params.id}/update`);
    }
};

async function displayUserDeletePage(req, res) {
    const detailsUser = req.userDetails;

    if (!detailsUser) {
        res.render(path.join(__dirname, '../views/error.ejs'));
    }

    res.status(200).render(
        path.join(__dirname, '../views/management/users/delete-user.ejs'),
            { detailsUser },
    );
}

async function deleteUser(req, res) {
    const user = req.userDetails;

    try {
        await User.deleteOne({ _id: user._id });

        req.session.message = `Utilisateur ${user.lastname} ${user.firstname} supprimé avec succès.`;
        res.redirect(`/users`);
    } catch (error) {
        req.session.message = 'Error delete' + error.message;
        res.redirect(`/users/${user._id}/delete`);
    }
}

module.exports = {
    displayUsersPage,
    displayCreateUserPage,
    createUser,
    displayUserDetailsPage,
    displayUserUpdatePage,
    displayUserDeletePage,
    deleteUser,
    updateUser,
}
