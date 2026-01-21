const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const he = require('he');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user (Send OTP)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists && userExists.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User already exists and is verified'
            });
        }

        let user;
        
        if (userExists && !userExists.isVerified) {
            // Update existing unverified user
            user = userExists;
            user.username = username;
            user.password = password; // This will be hashed by the pre-save hook
        } else {
            // Create new user (unverified)
            user = new User({
                username,
                email,
                password,
                isVerified: false
            });
        }

        // Generate OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP via email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification - Agribot',
                message: `Welcome to Agribot! Your verification code is: ${otp}. This code will expire in 10 minutes. If you didn't request this, please ignore this email.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #333; margin: 0;">Welcome to Agribot!</h1>
                                <p style="color: #666; margin: 10px 0;">Complete your registration</p>
                            </div>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                Hi <strong>${he.escape(user.username)}</strong>,
                            </p>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                Thank you for registering with Agribot! To complete your registration and verify your email address, please enter the verification code below:
                            </p>
                            
                            <div style="background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;">Your Verification Code:</p>
                                <h1 style="font-size: 48px; color: #007bff; margin: 0; letter-spacing: 8px; font-weight: bold;">${he.escape(otp)}</h1>
                            </div>
                            
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>Important:</strong> This verification code will expire in 10 minutes for security reasons.
                                </p>
                            </div>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                If you didn't create an account with Agribot, please ignore this email or contact our support team if you have concerns.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            
                            <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
                                This is an automated message from Agribot. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                `
            });

            res.status(200).json({
                success: true,
                message: 'Registration initiated. Please check your email for verification code.',
                userId: user._id,
                // Temporary: Include OTP in response for testing
                ...(process.env.NODE_ENV === 'development' && {
                    otp: otp,
                    note: 'OTP shown for development/testing purposes'
                })
            });

        } catch (emailError) {
            console.log(emailError);
            
            // Remove user if email fails to send
            await User.findByIdAndDelete(user._id);
            
            return res.status(500).json({
                success: false,
                message: 'Registration failed. Could not send verification email.'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Hash the provided OTP
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Find user with matching email, OTP, and non-expired OTP
        const user = await User.findOne({
            email,
            otpCode: hashedOTP,
            otpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Verify user and clear OTP fields
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpire = undefined;
        
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now log in.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find unverified user
        const user = await User.findOne({ email, isVerified: false });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already verified'
            });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP via email
        try {
            await sendEmail({
                email: user.email,
                subject: 'New Verification Code - Blog App',
                message: `Your new verification code is: ${otp}. This code will expire in 10 minutes. If you didn't request this, please ignore this email.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #333; margin: 0;">New Verification Code</h1>
                                <p style="color: #666; margin: 10px 0;">Agribot Email Verification</p>
                            </div>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                Hi <strong>${he.escape(user.username)}</strong>,
                            </p>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                You requested a new verification code for your Agribot account. Here's your new code:
                            </p>
                            
                            <div style="background-color: #f8f9fa; border: 2px dashed #28a745; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;">Your New Verification Code:</p>
                                <h1 style="font-size: 48px; color: #28a745; margin: 0; letter-spacing: 8px; font-weight: bold;">${he.escape(otp)}</h1>
                            </div>
                            
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>Important:</strong> This verification code will expire in 10 minutes. Your previous code is no longer valid.
                                </p>
                            </div>
                            
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                                If you didn't request a new code, please ignore this email or contact our support team.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            
                            <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
                                This is an automated message from Agribot. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                `
            });

            res.status(200).json({
                success: true,
                message: 'New verification code sent to your email.',
                // Temporary: Include OTP in response for testing
                ...(process.env.NODE_ENV === 'development' && {
                    otp: otp,
                    note: 'OTP shown for development/testing purposes'
                })
            });

        } catch (emailError) {
            console.log(emailError);
            return res.status(500).json({
                success: false,
                message: 'Could not send verification email'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in',
                needsVerification: true
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL (frontend URL)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email message
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - Blog App',
                message,
                html: `
                    <h2>Password Reset Request</h2>
                    <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
                    <p>Please click the link below to reset your password:</p>
                    <a href="${he.escape(resetUrl)}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p><strong>This link will expire in 10 minutes.</strong></p>
                `
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent',
                // Include these for development/testing only
                ...(process.env.NODE_ENV === 'development' && {
                    resetToken,
                    resetUrl,
                    note: 'Token and URL shown for development purposes only'
                })
            });

        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
