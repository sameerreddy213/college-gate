const express = require('express');
const { seedDatabase, healthCheck } = require('../controllers/systemController');
const router = express.Router();

router.get('/seed', seedDatabase);
router.get('/health', healthCheck);

module.exports = router;
