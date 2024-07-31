const express = require('express');
const path = require('path');
const router = express.Router();

router.use((_, res) => {
    res.status(404).render(path.join(__dirname, '../views/error.ejs'));
});

module.exports = router;