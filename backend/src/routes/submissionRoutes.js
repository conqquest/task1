const express = require('express');
const { initiateSubmission, confirmSubmission, getSubmissionStatus, getGroupSubmissions } = require('../controllers/submissionController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.post('/', initiateSubmission);
router.put('/:id/confirm', authorizeRole('admin'), confirmSubmission);
router.get('/status', getSubmissionStatus);
router.get('/group/:groupId', getGroupSubmissions);

module.exports = router;
