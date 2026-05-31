const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { updateMilestone, reachMilestone, deleteMilestone } = require('../controllers/milestoneController');

// /api/milestones/:id
router.put('/:id',       auth, role('admin', 'supervisor'), updateMilestone);
router.put('/:id/reach', auth, role('admin', 'supervisor', 'student'), reachMilestone);
router.delete('/:id',    auth, role('admin', 'supervisor'), deleteMilestone);

module.exports = router;
