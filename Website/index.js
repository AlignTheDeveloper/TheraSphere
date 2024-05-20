const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const account = require('./Model/account.js');
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("View"));

const port = process.env.PORT || 80;

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
      const results = await account.insertRow({ user_name: request.body.user_name, password: hashedPassword });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
