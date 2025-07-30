const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const checkAndCorrectURL = require('./checkAndCorrectURL');
const sendMail = require('./sendMail');

const { loadSettings } = require('@/middlewares/settings');
const { useAppSettings } = require('@/settings');

const register = async (req, res, { userModel }) => {
  try {
    console.log('Register function called with:', req.body, 'userModel:', userModel);
    
    const UserPasswordModel = mongoose.model(userModel + 'Password');
    const UserModel = mongoose.model(userModel);

    const settings = useAppSettings();

    const { name, email, password } = req.body;
    
    console.log('Register attempt:', { email, name, userModel });

    // Validation
    const objectSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
      password: Joi.string().required(),
    });

    const { error, value } = objectSchema.validate({ name, email, password });
    if (error) {
      console.log('Validation error:', error.message);
      return res.status(409).json({
        success: false,
        result: null,
        error: error,
        message: 'Invalid/Missing credentials.',
        errorMessage: error.message,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
      removed: false,
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });
    }

    // Generate salt and hash password
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(salt + password);

    // Generate email verification token
    const emailToken = jwt.sign(
      {
        id: Math.random().toString(36).substring(2, 15),
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create user
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      name,
      enabled: false, // User will be enabled after email verification
    });

    console.log('User created:', newUser._id);

    // Create password record
    await UserPasswordModel.create({
      user: newUser._id,
      password: passwordHash,
      salt,
      emailToken,
      emailVerified: false,
    });

    console.log('Password record created');

    // Send verification email
    const idurar_app_email = settings['idurar_app_email'];
    const idurar_base_url = settings['idurar_base_url'];
    
    const url = checkAndCorrectURL(idurar_base_url);
    const verificationLink = url + '/verify/' + newUser._id + '/' + emailToken;

    console.log('Sending verification email to:', email);

    try {
      await sendMail({
        email,
        name: newUser.name,
        link: verificationLink,
        subject: 'Verify Your Email - ' + settings['app_name'],
        idurar_app_email,
        type: 'emailVerfication',
        emailToken,
      });
      console.log('Verification email sent');
    } catch (emailError) {
      console.log('Email sending failed, but user was created:', emailError.message);
      // Continue without failing the registration
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    });

  } catch (error) {
    console.log('Registration error:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error. Please try again.',
      error: error.message,
    });
  }
};

module.exports = register;