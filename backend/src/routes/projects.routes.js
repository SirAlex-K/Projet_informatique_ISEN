const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

const { getAll, getOne, create, update, remove }   = require('../controllers/projectController');
const { getMembers, addMember, removeMember }       = require('../controllers/teamController');
const { getTasks, createTask }                      = require('../controllers/taskController');
const { getMilestones, createMilestone }            = require('../controllers/milestoneController');
const { getDeliverables, uploadDeliverable }        = require('../controllers/deliverableController');
const { getMessages, sendMessage }                  = require('../controllers/messageController');
const { getProjectComments, createComment }         = require('../controllers/commentController');
const { getEvaluations, createEvaluation }          = require('../controllers/evaluationController');

// ── Projets ──────────────────────────────────────────
router.get('/',       auth, getAll);
router.post('/',      auth, role('supervisor'), create);
router.get('/:id',    auth, getOne);
router.put('/:id',    auth, role('supervisor'), update);
router.delete('/:id', auth, role('supervisor'), remove);

// ── Membres ──────────────────────────────────────────
router.get('/:id/members',         auth, getMembers);
router.post('/:id/members',        auth, role('supervisor'), addMember);
router.delete('/:id/members/:uid', auth, role('supervisor'), removeMember);

// ── Tâches ───────────────────────────────────────────
router.get('/:id/tasks',  auth, getTasks);
router.post('/:id/tasks', auth, role('supervisor', 'team_leader'), createTask);

// ── Jalons ───────────────────────────────────────────
router.get('/:id/milestones',  auth, getMilestones);
router.post('/:id/milestones', auth, role('supervisor'), createMilestone);

// ── Livrables ────────────────────────────────────────
router.get('/:id/deliverables',  auth, getDeliverables);
router.post('/:id/deliverables', auth, upload.single('file'), uploadDeliverable);

// ── Messages ─────────────────────────────────────────
router.get('/:id/messages',  auth, getMessages);
router.post('/:id/messages', auth, sendMessage);

// ── Commentaires ─────────────────────────────────────
router.get('/:id/comments',  auth, getProjectComments);
router.post('/:id/comments', auth, createComment);

// ── Évaluations ──────────────────────────────────────
router.get('/:id/evaluations',  auth, getEvaluations);
router.post('/:id/evaluations', auth, role('jury'), createEvaluation);

module.exports = router;
