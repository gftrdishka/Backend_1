const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { getAllRequests, updateRequestStatus } = require('../controllers/adminController');

router.use(authMiddleware, adminMiddleware);

router.get('/requests', getAllRequests);
router.patch('/requests/:id/status', updateRequestStatus);

module.exports = router;
