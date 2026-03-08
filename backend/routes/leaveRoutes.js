const express = require('express');
const router = express.Router();
const { protect, employerOnly } = require('../utils/authMiddleware');
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');

router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/all', protect, employerOnly, getAllLeaves);
router.put('/:id', protect, employerOnly, updateLeaveStatus);

module.exports = router;