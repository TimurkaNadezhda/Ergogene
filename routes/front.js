const express = require('express');
const router = express.Router();
const {
    displayHomePage,
    displayBlogPage,
    displayContactsPage,
    handleContactsForm,
    displayPresentationsPage,
    displayFormationsPage,
    displayMentionsPage,
    displayConfidentialityPage
} = require('../controllers/front_controller');
const { contactValidator } = require('../middlewares/validators/contactValidator');

router.get('/', displayHomePage);
router.get('/blog', displayBlogPage);
router.get('/contact', displayContactsPage);
router.post('/contact', contactValidator, handleContactsForm);
router.get('/prestations', displayPresentationsPage);
router.get('/formations', displayFormationsPage);
router.get('/mentions-legales', displayMentionsPage);
router.get('/politique-de-confidentialite', displayConfidentialityPage);

module.exports = router;
