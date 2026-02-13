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
// Routes
const auth = require('./routes/auth');
const devAdmin = require('./routes/devAdmin');
const collegeAdmin = require('./routes/collegeAdmin');
const warden = require('./routes/warden');
const student = require('./routes/student');
const parent = require('./routes/parent');
const watchman = require('./routes/watchman');
const notification = require('./routes/notificationRoutes');
const system = require('./routes/system');

// Mount routes with /api prefix (for standard express/local)
app.use('/api/auth', auth);
app.use('/api/dev-admin', devAdmin);
app.use('/api/college-admin', collegeAdmin);
app.use('/api/warden', warden);
app.use('/api/student', student);
app.use('/api/parent', parent);
app.use('/api/watchman', watchman);
app.use('/api/notifications', notification);
app.use('/api/system', system);

// Mount routes WITHOUT /api prefix (for Vercel if prefix is stripped)
app.use('/auth', auth);
app.use('/dev-admin', devAdmin);
app.use('/college-admin', collegeAdmin);
app.use('/warden', warden);
app.use('/student', student);
app.use('/parent', parent);
app.use('/watchman', watchman);
app.use('/notifications', notification);
app.use('/system', system);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'CampusGate API is running' });
});

// Handle /api root request explicitly for health check
app.get('/api', (req, res) => {
    res.json({ message: 'CampusGate API is running at /api' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve static files from client/dist
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle SPA routing: serve index.html for any unknown non-API route
    app.get('*', (req, res, next) => {
        // If request is for API, don't serve index.html, let 404 handler catch it
        if (req.url.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    });
}

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Error Handler
app.use(errorHandler);

module.exports = app;
