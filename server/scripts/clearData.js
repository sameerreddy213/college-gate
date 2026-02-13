const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const College = require('../models/College');
const Student = require('../models/Student');
const OutingRequest = require('../models/OutingRequest');

dotenv.config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await User.deleteMany();
        await College.deleteMany();
        await Student.deleteMany();
        await OutingRequest.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearData();
