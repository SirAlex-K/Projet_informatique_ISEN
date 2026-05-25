const router = require('express').Router();
const { getTasks, createTask, updateTask, moveTask, deleteTask, getTaskHistory } = require('../controllers/taskController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/projects/:id/tasks',          auth, getTasks);
router.post('/projects/:id/tasks',         auth, role('supervisor', 'team_leader'), createTask);
router.put('/tasks/:id',                   auth, role('supervisor', 'team_leader'), updateTask);
router.put('/tasks/:id/move',              auth, role('supervisor', 'team_leader'), moveTask);
router.delete('/tasks/:id',               auth, role('supervisor', 'team_leader'), deleteTask);
router.get('/tasks/:id/history',           auth, getTaskHistory);

module.exports = router;
