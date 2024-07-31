const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const {
    displayUsersPage,
    displayCreateUserPage,
    createUser,
    displayUserDetailsPage,
    displayUserUpdatePage,
    displayUserDeletePage,
    deleteUser,
    updateUser,
    } = require('../controllers/users_controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { userCreateValidator } = require('../middlewares/validators/userCreateValidator');
const { userUpdateValidator } = require('../middlewares/validators/userUpdateValidator');

// Middleware, get user by ID and save it to request object or return error
const provideUser = async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });

    if (user) {
        req.userDetails = user;
        next();
    } else {
        res.render(path.join(__dirname, '../views/error.ejs'));
    }
}

// Middleware - Check if user has access to process
const hasAccess = (req, res, next) => {
    // You have access if:
    // 1. You are SuperAdmin
    // 2. You are admin and you want to process regular user or create new one
    // 3. You are user and you want to update yourself
    if (
        req.session.isSuperAdmin
        || (req.session.isAdmin && (!req.userDetails || req.userDetails.fullaccess == 'user'))
        || (req.userDetails && req.userDetails._id.equals(req.session.userId))
    ) {
        next();
    } else {
        res.render(path.join(__dirname, '../views/error.ejs'), { code: '403', message: 'Access Denied' });
    }
    console.log(req);
}

router.get('/users/create', [authMiddleware, hasAccess], displayCreateUserPage);
router.post('/users/create', [authMiddleware, userCreateValidator, hasAccess], createUser);

router.get('/users', authMiddleware, displayUsersPage);
router.get('/users/:id', [authMiddleware, provideUser], displayUserDetailsPage);

// chain of three middlewares: check auth, then get user by ID, then check access of authenticated user to proccess
router.get('/users/:id/update', [authMiddleware, provideUser, hasAccess], displayUserUpdatePage);
router.put('/users/:id/update', [authMiddleware, userUpdateValidator, provideUser, hasAccess], updateUser);

router.get('/users/:id/delete', [authMiddleware, provideUser, hasAccess], displayUserDeletePage);
router.delete('/users/:id/delete', [authMiddleware, provideUser, hasAccess], deleteUser);

module.exports = router;
