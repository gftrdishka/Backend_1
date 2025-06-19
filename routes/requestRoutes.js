const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createRequest, getUserRequests, leaveFeedback } = require('../controllers/requestController');

router.use(authMiddleware);

router.post('/', createRequest);
router.get('/', getUserRequests);
router.post('/:id/feedback', leaveFeedback);

module.exports = router;
