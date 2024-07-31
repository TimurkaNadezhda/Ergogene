// https://express-validator.github.io/docs/api/validation-chain/
const { checkSchema, validationResult } = require('express-validator');

exports.postCreateValidator = async (req, res, next) => {
    await checkSchema({
        title: { notEmpty: true, isString: true, errorMessage: 'Le titre est obligatoire' },
        subtitle: { notEmpty: true, isString: true, errorMessage: 'Le sous-titré est obligatoire' },
        date: { notEmpty: true, errorMessage: 'La date est obligatoire' },
        summary: { notEmpty: true, isString: true, errorMessage: 'Le résumé est obligatoire' },
        link: { notEmpty: true, isString: true, isURL: true, errorMessage: 'Please, provide correct URL' },
        status: { isBoolean: true },
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array().map(e => e.msg);
        req.session.formData = req.body;

        res.redirect('/posts/create');
    } else {
        next();
    }
}
