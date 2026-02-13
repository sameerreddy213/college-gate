const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../server/models/User');
const connectDB = require('../server/config/db');

// Explicitly load env if needed, though Vercel handles it
dotenv.config();

module.exports = async (req, res) => {
    try {
        await connectDB();

        // Check if Dev Admin already exists to prevent accidental resets
        const existingAdmin = await User.findOne({ role: 'dev-admin' });
        if (existingAdmin) {
            return res.status(200).json({
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
            message: 'Dev Admin Created Successfully',
            user: {
                name: devAdmin.name,
                email: devAdmin.email,
                role: devAdmin.role
            },
            credentials: {
                email: 'admin@campusgate.com',
                password: 'password123'
            }
        });

    } catch (error) {
        console.error('Seed Error:', error);
        res.status(500).json({
            message: 'Failed to seed database',
            error: error.message
        });
    }
};
