const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { getOptions, getAllUsers, getUser, createUser, updateUser, deleteUser, getUsersByRole } = require('../controllers/adminController');

router.get('/options',            auth, role('admin'), getOptions);
router.get('/users',              auth, role('admin'), getAllUsers);
router.post('/users',             auth, role('admin'), createUser);
router.get('/users/by-role/:role',auth, role('admin'), getUsersByRole);
router.get('/users/:id',          auth, role('admin'), getUser);
router.put('/users/:id',          auth, role('admin'), updateUser);
router.delete('/users/:id',       auth, role('admin'), deleteUser);

module.exports = router;
