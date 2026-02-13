const express = require('express');
const { createCollege, getColleges, createCollegeAdmin, getGlobalAnalytics, deleteCollege, updateCollege } = require('../controllers/devAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and restricted to dev-admin
router.use(protect);
router.use(authorize('dev-admin'));

router.route('/colleges')
    .get(getColleges)
    .post(createCollege);

router.route('/colleges/:id')
    .put(updateCollege)
    .delete(require('../controllers/devAdminController').deleteCollege);

router.post('/create-admin', createCollegeAdmin);
router.get('/analytics', getGlobalAnalytics);
router.put('/colleges/:id/status', require('../controllers/devAdminController').toggleCollegeStatus);

module.exports = router;
