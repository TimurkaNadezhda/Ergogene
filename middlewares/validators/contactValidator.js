// https://express-validator.github.io/docs/api/validation-chain/
const { checkSchema, validationResult } = require('express-validator');

exports.contactValidator = async (req, res, next) => {
    await checkSchema({
        lastname: { notEmpty: true, isString: true, errorMessage: 'Le Nom est obligatoire' },
        // TODO add other checks
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array().map(e => e.msg);
        req.session.formData = req.body;

        res.redirect('/contact');
    } else {
        next();
    }
}
