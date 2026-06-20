const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { updateEvaluation, deleteEvaluation } = require('../controllers/evaluationController');

// /api/evaluations/:id
router.put('/:id',    auth, role('admin', 'supervisor'), updateEvaluation);
router.delete('/:id', auth, role('admin', 'supervisor'), deleteEvaluation);

module.exports = router;
