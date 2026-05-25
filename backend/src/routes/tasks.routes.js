const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { updateTask, moveTask, deleteTask, getTaskHistory } = require('../controllers/taskController');
const { getTaskComments }                                  = require('../controllers/commentController');

// /api/tasks/:id
router.put('/:id',          auth, role('supervisor', 'team_leader'), updateTask);
router.put('/:id/move',     auth, role('supervisor', 'team_leader'), moveTask);
router.delete('/:id',       auth, role('supervisor', 'team_leader'), deleteTask);
router.get('/:id/history',  auth, getTaskHistory);
router.get('/:id/comments', auth, getTaskComments);

module.exports = router;
