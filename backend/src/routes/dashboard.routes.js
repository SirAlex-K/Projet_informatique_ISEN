const router = require('express').Router();
const { supervisorDashboard, projectStats } = require('../controllers/dashboardController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/supervisor', auth, role('supervisor'), supervisorDashboard);
router.get('/project/:id', auth, projectStats);

module.exports = router;
