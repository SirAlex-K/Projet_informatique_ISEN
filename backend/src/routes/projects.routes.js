const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { isLeaderOrSupervisor } = require('../middlewares/projectRole.middleware');
const upload = require('../middlewares/upload.middleware');

const { getAll, getOne, create, update, remove }   = require('../controllers/projectController');
const { getMembers, addMember, removeMember }       = require('../controllers/teamController');
const { getGroups, getGroup, joinGroup, chooseSubject } = require('../controllers/groupController');
const { getTasks, createTask }                      = require('../controllers/taskController');
const { getMilestones, createMilestone }            = require('../controllers/milestoneController');
const { getDeliverables, uploadDeliverable }        = require('../controllers/deliverableController');
const { getMessages, sendMessage }                  = require('../controllers/messageController');
const { getProjectComments, createComment }         = require('../controllers/commentController');
const { getEvaluations, createEvaluation }          = require('../controllers/evaluationController');

// Projets
router.get('/',       auth, getAll);
router.post('/',      auth, role('admin', 'supervisor'), create);
router.get('/:id',    auth, getOne);
router.put('/:id',    auth, role('admin', 'supervisor'), update);
router.delete('/:id', auth, role('admin', 'supervisor'), remove);

// Membres
router.get('/:id/members',         auth, getMembers);
router.post('/:id/members',        auth, role('admin', 'supervisor'), addMember);
router.delete('/:id/members/:uid', auth, role('admin', 'supervisor'), removeMember);

// Groupes
router.get('/:id/groups',            auth, getGroups);
router.get('/:id/groups/:gid',       auth, getGroup);
router.post('/:id/groups/:gid/join', auth, joinGroup);
router.put('/:id/groups/:gid/sujet', auth, chooseSubject);

// Taches
router.get('/:id/tasks',  auth, getTasks);
router.post('/:id/tasks', auth, isLeaderOrSupervisor, createTask);

// Jalons
router.get('/:id/milestones',  auth, getMilestones);
router.post('/:id/milestones', auth, isLeaderOrSupervisor, createMilestone);

// Livrables
router.get('/:id/deliverables',  auth, getDeliverables);
router.post('/:id/deliverables', auth, upload.single('file'), uploadDeliverable);

// Messages
router.get('/:id/messages',  auth, getMessages);
router.post('/:id/messages', auth, upload.single('fichier'), sendMessage);

// Commentaires
router.get('/:id/comments',  auth, getProjectComments);
router.post('/:id/comments', auth, createComment);

// Evaluations
router.get('/:id/evaluations',  auth, getEvaluations);
router.post('/:id/evaluations', auth, role('admin', 'supervisor'), createEvaluation);

module.exports = router;
