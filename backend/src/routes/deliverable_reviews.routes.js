const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { getReviews, createReview } = require('../controllers/deliverableReviewController');

// /api/deliverables/:id/reviews
router.get('/:id/reviews',  auth, getReviews);
router.post('/:id/reviews', auth, role('supervisor'), createReview);

module.exports = router;
