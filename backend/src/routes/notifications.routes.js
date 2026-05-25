const router = require('express').Router();
const { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const auth = require('../middlewares/auth.middleware');

router.get('/',             auth, getMyNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/read-all',     auth, markAllAsRead);
router.put('/:id/read',     auth, markAsRead);

module.exports = router;
