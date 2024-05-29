require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const account = require('./Model/account.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("View"));

const port = process.env.PORT || 80;

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoint to sign in to an account
app.post('/account/login/', upload.none(),
  async (request, response) => {
    try {
      const user = await account.findUserByUserName(request.body.user_name);
      if (!user) {
        return response.status(404).json({ message: 'User not found.' });
      }
      const match = await bcrypt.compare(request.body.password, user.password);
      if (!match) {
        return response.status(401).json({ message: 'Invalid password.' });
      }
      // Set HTTP-only cookie
      response.cookie('user', JSON.stringify({ user_id: user.user_id, user_name: user.user_name }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      return response.json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
  }
);

// Endpoint to create a new account
app.post('/account/', upload.none(),
  check('user_name', 'Username must be at least 5 characters long and cannot contain spaces.').matches(/^[^\s]{5,}$/),
  check('email', 'Must be a valid email.').isEmail(),
  check('password', 'Password must be at least 8 characters long.').isLength({ min: 8 }),
  check('password', 'Password must contain at least one Uppercase Letter.').matches(/[A-Z]/),
  check('password', 'Password must contain at least one Lowercase Letter.').matches(/[a-z]/),
  check('password', 'Password must contain at least one Number.').matches(/[0-9]/),
  check('password', 'Password must contain at least one Special Character.').matches(/[^A-Za-z0-9]/),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return response.status(400).json({
        message: 'Request fields or files are invalid.',
        errors: errors.array(),
      });
    }
    const saltRounds = 10;
    try {
      // Check if username already exists
      const userExists = await account.findUserByUserName(request.body.user_name);
      if (userExists) {
        return response.status(409).json({ message: 'Username already exists.' });
      }

      const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
      const results = await account.insertRow({ 
        user_name: request.body.user_name, 
        email: request.body.email,
        password: hashedPassword 
      });
      return response.json({ data: results });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Something went wrong with the server.' });
    }
  }
);

// Endpoint to get user data from cookie
app.get('/account/user', (req, res) => {
  const userCookie = req.cookies.user;
  if (userCookie) {
    const user = JSON.parse(userCookie);
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/account/forgot-password', async (req, res) => {
  try {
    const { user_name } = req.body;
    const user = await account.findUserByUserName(user_name) || await account.findUserByEmail(user_name);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await account.setResetToken(user.id, token, expires);

    const msg = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset-password.html?token=${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    sgMail.send(msg)
      .then(() => {
        res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
      })
      .catch(error => {
        console.error('There was an error: ', error);
        res.status(500).json({ message: 'Error sending the email.' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong with the server.' });
  }
});

app.post('/account/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await account.findUserByToken(token);
    if (!user || user.reset_token_expires < Date.now()) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await account.updatePassword(user.id, hashedPassword);
    await account.clearResetToken(user.id);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong with the server.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
