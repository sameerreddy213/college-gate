const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: Object
    },
    ip: {
        type: String
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
