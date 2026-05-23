const router = require('express').Router();
const { getMembers, addMember, removeMember } = require('../controllers/teamController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/:id/members', auth, getMembers);
router.post('/:id/members', auth, role('supervisor'), addMember);
router.delete('/:id/members/:uid', auth, role('supervisor'), removeMember);

module.exports = router;
