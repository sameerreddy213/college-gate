const { check, validationResult } = require('express-validator');
const { ErrorResponse } = require('../middleware/errorMiddleware');

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return next(new ErrorResponse(message, 400));
    }
    next();
};

exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validateResult
];

exports.loginValidator = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validateResult
];

exports.createCollegeValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('code', 'Code is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    validateResult
];

exports.createWardenValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validateResult
];

exports.createStudentValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('rollNumber', 'Roll Number is required').not().isEmpty(),
    check('department', 'Department is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
    check('parentName', 'Parent Name is required').not().isEmpty(),
    check('parentPhone', 'Parent Phone is required').not().isEmpty(),
    validateResult
];

exports.otpValidator = [
    check('phone', 'Phone number is required').not().isEmpty(),
    check('otp', 'OTP is required').not().isEmpty(),
    validateResult
];
