const router = require('express').Router();
const { getDeliverables, uploadDeliverable, deleteDeliverable } = require('../controllers/deliverableController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/:id/deliverables', auth, getDeliverables);
router.post('/:id/deliverables', auth, upload.single('fichier'), uploadDeliverable);
router.delete('/deliverables/:id', auth, role('supervisor'), deleteDeliverable);

module.exports = router;
