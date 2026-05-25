const router = require('express').Router();
const { getMilestones, createMilestone, updateMilestone, reachMilestone, deleteMilestone } = require('../controllers/milestoneController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/projects/:id/milestones',          auth, getMilestones);
router.post('/projects/:id/milestones',         auth, role('supervisor'), createMilestone);
router.put('/milestones/:id',                   auth, role('supervisor'), updateMilestone);
router.put('/milestones/:id/reach',             auth, role('supervisor', 'team_leader'), reachMilestone);
router.delete('/milestones/:id',               auth, role('supervisor'), deleteMilestone);

module.exports = router;
