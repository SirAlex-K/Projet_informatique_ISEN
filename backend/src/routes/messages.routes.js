const router = require('express').Router();
const { getMessages, sendMessage, markRead } = require('../controllers/messageController');
const auth = require('../middlewares/auth.middleware');

router.get('/projects/:id/messages', auth, getMessages);
router.post('/projects/:id/messages', auth, sendMessage);
router.put('/messages/:id/read', auth, markRead);

module.exports = router;
