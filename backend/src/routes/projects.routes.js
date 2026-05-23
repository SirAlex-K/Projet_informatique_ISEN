const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/projectController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', auth, getAll);
router.get('/:id', auth, getOne);
router.post('/', auth, role('supervisor'), create);
router.put('/:id', auth, role('supervisor'), update);
router.delete('/:id', auth, role('supervisor'), remove);

module.exports = router;
