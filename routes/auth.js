const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAuthenticated, isGuest } = require('../middlewares/verifyLogin');
const { loginValidator } = require('../middlewares/validators/loginValidator');
const { signInValidator } = require('../middlewares/validators/signInValidator');
const {
    displayLoginPage,
    signIn,
    displayLogoutPage,
    logout,
} = require('../controllers/auth_controller');

router.get('/signin', isGuest, displayLoginPage);
router.post('/signin', [signInValidator, loginValidator], signIn);

router.get('/logout', isAuthenticated, authMiddleware, displayLogoutPage)
router.post('/logout', authMiddleware, logout);

module.exports = router;
