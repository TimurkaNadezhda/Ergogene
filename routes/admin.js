const express = require('express');
const path = require('path');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/admin', authMiddleware, (_, res) => {
    res.status(200).render(path.join(__dirname, '../views/management/admin.ejs'));
});

module.exports = router;