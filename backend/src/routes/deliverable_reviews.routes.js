const router = require('express').Router();
const { getReviews, createReview } = require('../controllers/deliverableReviewController');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/deliverables/:id/reviews',  auth, getReviews);
router.post('/deliverables/:id/reviews', auth, role('supervisor'), createReview);

module.exports = router;
