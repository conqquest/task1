const express = require('express');
const { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

router.post('/', authorizeRole('admin'), createAssignment);
router.put('/:id', authorizeRole('admin'), updateAssignment);
router.delete('/:id', authorizeRole('admin'), deleteAssignment);

module.exports = router;
