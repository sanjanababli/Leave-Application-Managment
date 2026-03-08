const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName:  { type: String, required: true },
    employeeEmail: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Maternity/Paternity Leave', 'Unpaid Leave'],
      required: [true, 'Leave type is required'],
    },
    startDate:       { type: Date, required: true },
    endDate:         { type: Date, required: true },
    reason:          { type: String, required: true, trim: true },
    status:          { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    employerComment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);