const express = require('express');
const {
    getDashboardStats,
    updateRequestStatus,
    getHistory
} = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { tenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('parent'));
router.use(tenant);
// Note: Parent might not have collegeId in req.user initially if created on fly?
// But our Auth logic assigns collegeId. 
// However, parents can have kids in multiple colleges? (Edge case not in requirements)
// Assuming parent is tied to one college for now or derived from student.
// Tenant middleware might fail if parent user doesn't have collegeId.
// Let's assume parent user has collegeId for now as per User model.

router.get('/dashboard', getDashboardStats);
router.put('/requests/:id', updateRequestStatus);
router.get('/history', getHistory);

module.exports = router;
