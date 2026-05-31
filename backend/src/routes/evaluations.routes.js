const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { deleteEvaluation } = require('../controllers/evaluationController');

// /api/evaluations/:id
router.delete('/:id', auth, role('admin', 'supervisor'), deleteEvaluation);

module.exports = router;
