const router = require('express').Router();
const { getCards, createCard, updateCard, moveCard, deleteCard } = require('../controllers/kanbanController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

// Routes sur les projets
router.get('/projects/:id/cards', auth, getCards);
router.post('/projects/:id/cards', auth, role('supervisor'), createCard);

// Routes sur les cartes
router.put('/cards/:id', auth, role('supervisor'), updateCard);
router.put('/cards/:id/move', auth, role('supervisor'), moveCard);
router.delete('/cards/:id', auth, role('supervisor'), deleteCard);

module.exports = router;
