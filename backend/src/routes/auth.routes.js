const router = require('express').Router();
const { register, login, me, myProject } = require('../controllers/authController');
const auth = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/me/project', auth, myProject);

module.exports = router;
