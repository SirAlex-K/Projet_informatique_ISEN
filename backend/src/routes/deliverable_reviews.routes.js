const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { getReviews, createReview } = require('../controllers/deliverableReviewController');
const { deleteDeliverable } = require('../controllers/deliverableController');

router.delete('/:id', auth, deleteDeliverable);

// /api/deliverables/:id/reviews
router.get('/:id/reviews',  auth, getReviews);
router.post('/:id/reviews', auth, role('supervisor'), createReview);

module.exports = router;
