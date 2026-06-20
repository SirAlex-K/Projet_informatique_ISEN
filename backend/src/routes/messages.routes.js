const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { updateMessage, deleteMessage } = require('../controllers/messageController');

router.put('/:id', auth, updateMessage);
router.delete('/:id', auth, deleteMessage);

module.exports = router;
