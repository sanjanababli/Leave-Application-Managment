const Leave = require('../models/Leave');

// ── POST /api/leaves  (Employee applies) ─────────────────────
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    const leave = await Leave.create({
      employee:      req.user._id,
      employeeName:  req.user.name,
      employeeEmail: req.user.email,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ message: 'Leave application submitted!', leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/leaves/my  (Employee sees own requests) ─────────
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/leaves/all  (Employer sees all requests) ────────
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── PUT /api/leaves/:id  (Employer approves or rejects) ──────
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, employerComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status          = status;
    leave.employerComment = employerComment || '';
    await leave.save();

    res.json({ message: `Leave request ${status}!`, leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };