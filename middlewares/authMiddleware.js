const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.render(
                path.join(__dirname, `../views/error.ejs`),
                { message: 'Non autorisé', code: '401' }
            );
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.redirect('/signin');
        }
        
        req.decodedToken = decodedToken;
        req.session.isConnected = true;
        req.session.userId = user._id;
        req.session.isAdmin = (user.fullaccess == 'superadmin' || user.fullaccess == 'admin');
        req.session.isSuperAdmin = user.fullaccess == 'superadmin';
        
        next();
    }
    catch (error) {
        return res.render(
            path.join(__dirname, `../views/error.ejs`),
            { message: error.message, code: '500' }
        );
    }
}
