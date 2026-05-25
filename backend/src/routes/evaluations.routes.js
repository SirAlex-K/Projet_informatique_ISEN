const router = require('express').Router();
const { getEvaluations, createEvaluation, deleteEvaluation } = require('../controllers/evaluationController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/projects/:id/evaluations',  auth, getEvaluations);
router.post('/projects/:id/evaluations', auth, role('jury'), createEvaluation);
router.delete('/evaluations/:id',        auth, role('jury'), deleteEvaluation);

module.exports = router;
