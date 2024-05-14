const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const account = require('./Model/account.js');
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json()); // Add this to parse JSON bodies
app.use(express.static("View"));

const port = process.env.PORT || 80;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
