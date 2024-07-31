function isGuest(req, res, next) {
    if (req.session.isConnected) { 
        res.redirect('/admin');
    } else {
        next(); 
    }
}

function isAuthenticated(req, res, next) {
    if (!req.session.isConnected) { 
        res.redirect('/signin');
    } else {
        next(); 
    }
}

function isAdmin(req, res, next) {
    if (!req.session.isAdmin) { 
        req.session.userNotAuthorised = `Vous n'êtes pas autorisé à accéder à cette page.`;
        res.redirect('/');
    } else {
        next(); 
    }
}

module.exports = {
    isGuest,
    isAuthenticated,
    isAdmin,
};
