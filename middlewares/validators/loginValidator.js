const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.loginValidator = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    const compare = await bcrypt.compare(req.body.password, user.password);

    if (!user || !compare) {
        req.session.errors = ['Mot de passe ou Email incorrect'];
        req.session.formData = req.body;

        res.redirect('/signin');
    } else {
        req.user = user;
        next();
    }
}
