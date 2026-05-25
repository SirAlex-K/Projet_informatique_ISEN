const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const { updateComment, deleteComment } = require('../controllers/commentController');

// /api/comments/:id
router.put('/:id',    auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
