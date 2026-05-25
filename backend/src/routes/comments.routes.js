const router = require('express').Router();
const { getProjectComments, getTaskComments, createComment, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middlewares/auth.middleware');

router.get('/projects/:id/comments',  auth, getProjectComments);
router.post('/projects/:id/comments', auth, createComment);
router.get('/tasks/:id/comments',     auth, getTaskComments);
router.put('/comments/:id',           auth, updateComment);
router.delete('/comments/:id',        auth, deleteComment);

module.exports = router;
