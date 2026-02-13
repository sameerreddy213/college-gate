const { ErrorResponse } = require('./errorMiddleware');

// Enforce tenant isolation
exports.tenant = (req, res, next) => {
    // Skip for dev-admin
    if (req.user.role === 'dev-admin') {
        return next();
    }

    if (!req.user.collegeId) {
        return next(new ErrorResponse('User not associated with any college', 400));
    }

    // Attach collegeId to request object for easy access in controllers
    // This effectively scopes the request to the tenant
    req.collegeId = req.user.collegeId;
    next();
};
