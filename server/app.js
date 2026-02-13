const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
// connectDB(); // Called in server.js

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-mongo-sanitize')()); // Prevent NoSQL injection
app.use(require('xss-clean')()); // Prevent XSS attacks
app.use(require('hpp')()); // Prevent HTTP Parameter Pollution
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dev-admin', require('./routes/devAdmin'));
app.use('/api/college-admin', require('./routes/collegeAdmin'));
app.use('/api/warden', require('./routes/warden'));
app.use('/api/student', require('./routes/student'));
app.use('/api/parent', require('./routes/parent'));
app.use('/api/watchman', require('./routes/watchman'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'CampusGate API is running' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
