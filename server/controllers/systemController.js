const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Seed the database with initial admin
// @route   GET /api/system/seed
// @access  Public
exports.seedDatabase = asyncHandler(async (req, res) => {
    // Check if Dev Admin already exists
    const existingAdmin = await User.findOne({ role: 'dev-admin' });
    if (existingAdmin) {
        return res.status(200).json({
            success: true,
            message: 'Dev Admin already exists. No action taken.',
            email: existingAdmin.email
        });
    }

    // Create Dev Admin
    const devAdmin = await User.create({
        name: 'Dev Admin',
        email: 'admin@campusgate.com',
        password: 'password123',
        phone: '1234567890',
        role: 'dev-admin'
    });

    res.status(201).json({
        success: true,
        message: 'Dev Admin Created Successfully',
        credentials: {
            email: 'admin@campusgate.com',
            password: 'password123'
        }
    });
});

// @desc    Health Check
// @route   GET /api/system/health
// @access  Public
exports.healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'System is healthy',
        timestamp: new Date().toISOString(),
        env: {
            MONGO_URI_CONFIGURED: !!process.env.MONGO_URI,
            JWT_SECRET_CONFIGURED: !!process.env.JWT_SECRET
        }
    });
};
