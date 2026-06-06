const router = require('express').Router();
const { supervisorDashboard, studentDashboard, projectStats } = require('../controllers/dashboardController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/supervisor', auth, role('supervisor', 'admin'), supervisorDashboard);
router.get('/student',   auth, role('student'), studentDashboard);
router.get('/project/:id', auth, projectStats);

module.exports = router;
