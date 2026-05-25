const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { updateMilestone, reachMilestone, deleteMilestone } = require('../controllers/milestoneController');

// /api/milestones/:id
router.put('/:id',       auth, role('supervisor'), updateMilestone);
router.put('/:id/reach', auth, role('supervisor', 'team_leader'), reachMilestone);
router.delete('/:id',    auth, role('supervisor'), deleteMilestone);

module.exports = router;
