const express = require('express');
const {
    getDashboardStats,
    raiseRequest,
    cancelRequest,
    getMyRequests,
    getHistory
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { tenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('student'));
router.use(tenant);

const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

router.get('/dashboard', getDashboardStats);
router.route('/requests')
    .get(getMyRequests)
    .post([
        check('purpose', 'Purpose is required').not().isEmpty(),
        check('destination', 'Destination is required').not().isEmpty(),
        check('outDate', 'Out date is required').not().isEmpty(),
        validate
    ], raiseRequest);

router.put('/requests/:id/cancel', cancelRequest);

router.get('/history', getHistory);

module.exports = router;
