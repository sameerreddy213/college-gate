const express = require('express');
const {
    login,
    getMe,
    sendOtp,
    verifyOtp,
    updatePassword,
    updateDetails
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// const { loginValidator, otpValidator } = require('../utils/validators'); 

const router = express.Router();

const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// router.post('/login', loginValidator, login);
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate
], login);
// router.post('/parent/send-otp', otpValidator, sendOtp); // otpValidator checks for otp presence, but send-otp only needs phone
router.post('/parent/send-otp', sendOtp);
router.post('/parent/verify-otp', verifyOtp);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatedetails', protect, updateDetails);
router.get('/me', protect, getMe);

module.exports = router;
