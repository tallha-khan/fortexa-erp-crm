const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const verify = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);

  const { userId, emailToken } = req.params;

  if (!userId || !emailToken) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid verification link.',
    });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(emailToken, process.env.JWT_SECRET);

    // Find the user and password record
    const user = await UserModel.findOne({
      _id: userId,
      removed: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid verification link or user not found.',
      });
    }

    const userPassword = await UserPasswordModel.findOne({
      user: userId,
      emailToken: emailToken,
      removed: false,
    });

    if (!userPassword) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid verification link or token has been used.',
      });
    }

    if (userPassword.emailVerified) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email has already been verified.',
      });
    }

    // Update user and password records
    await UserModel.findByIdAndUpdate(userId, {
      enabled: true,
    });

    await UserPasswordModel.findOneAndUpdate(
      { user: userId },
      {
        emailVerified: true,
        emailToken: null, // Clear the token after use
      }
    );

    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enabled: true,
        emailVerified: true,
      },
      message: 'Email verified successfully. You can now log in.',
    });

  } catch (error) {
    console.log('Email verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Verification link has expired. Please request a new one.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid verification link.',
      });
    }

    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error. Please try again.',
      error: error.message,
    });
  }
};

module.exports = verify;