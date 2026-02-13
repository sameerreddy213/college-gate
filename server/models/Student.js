const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: [true, 'Please add a roll number'],
        uppercase: true
    },
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    wardenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentName: {
        type: String,
        required: [true, 'Please add parent name']
    },
    parentPhone: {
        type: String,
        required: [true, 'Please add parent phone']
    },
    parentEmail: {
        type: String,
        // Optional if we use phone for OTP
    }
}, {
    timestamps: true
});

// Indexes
studentSchema.index({ collegeId: 1 });
studentSchema.index({ wardenId: 1 });
studentSchema.index({ parentPhone: 1 });

module.exports = mongoose.model('Student', studentSchema);
