const { validationResult } = require('express-validator');
const { ErrorResponse } = require('./errorMiddleware');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return next(new ErrorResponse(message, 400));
    }
    next();
};
