const express = require('express');
const { createGroup, getMyGroups, getAllGroups, joinGroup, addMember, removeMember, getGroupMembers } = require('../controllers/groupController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.post('/', createGroup);
router.get('/my', getMyGroups);
router.get('/all', authorizeRole('admin'), getAllGroups);
router.post('/join', joinGroup);
router.get('/:groupId/members', getGroupMembers);
router.post('/:groupId/members', addMember);
router.delete('/:groupId/members/:memberId', removeMember);

module.exports = router;
