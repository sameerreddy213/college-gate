const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany({ role: 'dev-admin' });

        const devAdmin = await User.create({
            name: 'Dev Admin',
            email: 'admin@campusgate.com',
            password: 'password123',
            phone: '1234567890',
            role: 'dev-admin'
        });

        console.log('Dev Admin Created:');
        console.log('Email: admin@campusgate.com');
        console.log('Password: password123');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
