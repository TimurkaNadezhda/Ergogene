// https://express-validator.github.io/docs/api/validation-chain/
const { checkSchema, validationResult } = require('express-validator');

exports.signInValidator = async (req, res, next) => {
    await checkSchema({
        email: { notEmpty: true, isEmail: true, errorMessage: 'Please, enter correct email' },
        password: { notEmpty: true, isString: true, errorMessage: 'Password field is required' },
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array().map(e => e.msg);
        req.session.formData = req.body;

        res.redirect('/signin');
    } else {
        next();
    }
}
