const express = require('express');
const { getDashboardStats, getSubmissionsByAssignment, getGroupProgress } = require('../controllers/analyticsController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, authorizeRole('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/submissions-by-assignment', getSubmissionsByAssignment);
router.get('/group-progress', getGroupProgress);

module.exports = router;
