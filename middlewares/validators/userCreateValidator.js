// https://express-validator.github.io/docs/api/validation-chain/
const { checkSchema, validationResult } = require('express-validator');
const User = require('../../models/User');

exports.userCreateValidator = async (req, res, next) => {
    await checkSchema({
        firstname: { notEmpty: true, isString: true, errorMessage: 'Firstname field is required' },
        lastname: { notEmpty: true, isString: true, errorMessage: 'Lastname field is required' },
        email: { notEmpty: true, isEmail: true, errorMessage: 'Email field is required' },
        password: { notEmpty: true, isString: true, errorMessage: 'Password field is required' },
        confirm: {
            notEmpty: true,
            isString: true,
            errorMessage: 'Wrong password confiramtion',
        },
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array().map(e => e.msg);
        req.session.formData = req.body;

        res.redirect('/users/create');
    } else {
        const user = await User.findOne({ email: req.body.emai });

        if (user) {
            req.session.errors = ['User already exists'];
            req.session.formData = req.body;

            res.redirect('/users/create');
        } else {
            next();
        }
    }
}
