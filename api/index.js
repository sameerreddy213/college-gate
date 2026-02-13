const app = require('../server/app');
const connectDB = require('../server/config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../server/.env' });

// Connect to database
connectDB();

module.exports = app;
