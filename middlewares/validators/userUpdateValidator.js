// https://express-validator.github.io/docs/api/validation-chain/
const { checkSchema, validationResult } = require('express-validator');
const User = require('../../models/User');

exports.userUpdateValidator = async (req, res, next) => {
    await checkSchema({
        firstname: { notEmpty: true, isString: true, errorMessage: 'Firstname field is required' },
        lastname: { notEmpty: true, isString: true, errorMessage: 'Lastname field is required' },
        email: { notEmpty: true, isEmail: true, errorMessage: 'Email field is required' },
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.formData = req.body;

        res.redirect(`/users/${req.params.id}/update`);
    } else {
        // if exists another user with the same email
        const user = await User.findOne({
            '_id': { $ne: req.params.id },
            email: req.body.email,
        });

        if (user) {
            req.session.errors = ['User already exists'];
            req.session.formData = req.body;

            res.redirect(`/users/${req.params.id}/update`);
        } else {
            next();
        }
    }
}
