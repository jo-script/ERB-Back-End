const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get user profile
router.get('/getUser', async (req, res) => {
  try {
    const user = await User.find();                          // Find all users in the database
    res.json(user);                                          // Send the user data in JSON format
  } catch (err) {
    res.status(500).json({ error: 'Server error' });         // Send a 500 status and an error message in JSON format if an error occurs
  }
});

// Route to get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password') // Find all users in the database
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user);                                          // Send the user data in JSON format
  } catch (err) {
    res.status(500).json({ error: 'Server error' });         // Send a 500 status and an error message in JSON format if an error occurs
  }
});

// Route to register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;            // Destructure the username, email, and password from the request body
  if (!username || !email || !password) res.status(400).json('All fields are required. ')

  try {
    const userExists = await User.findOne({ email });        // Check if a user with the given email already exists
    if (userExists) {
      return res.status(400).json({ error: 'This email already exists, try login.' }); // Send a 400 status and an error message in JSON format if the email is already in use
    }

    const user = new User({ username, email, password });    // Create a new user instance with the provided data
    await user.save();                                       // Save the new user to the database
    res.status(201).json(user);                              // Send a 201 status and the new user data in JSON format
  } catch (err) {
    res.status(400).json({ error: err.message });            // Send a 400 status and the error message in JSON format if an error occurs
  }
});

// Route to log in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure the email and password from the request body
  if (!email || !password) res.status(400).json('All fields are required. ')

  try {
    const user = await User.findOne({ email });              // Find a user with the given email
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentialsInvalid email or password' }); // Send a 401 status and an error message in JSON format if the user is not found
    }
    const isMatch = await user.matchPassword(password);      // Check if the provided password matches the stored password

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' }); // Send a 401 status and an error message in JSON format if the password does not match
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { // Generate a JWT token with the user's ID and a secret key
      expiresIn: '1h',                                        // Set the token to expire in 1 hour
    });
    res.json({ token });                                      // Send the token in JSON format
  } catch (err) {
    res.status(400).json({ error: err.message });             // Send a 400 status and the error message in JSON format if an error occurs
  }
});

// Route to update a user
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { username, email, password } = req.body;             // Destructure the username, email, and password from the request body
  try {
    const user = await User.findById(req.user.id);            // Find the user by ID
    if (username) user.username = username;                   // Update the username if provided
    if (email) user.email = email;                            // Update the email if provided
    if (password) user.password = password;                   // Update the password if provided
    await user.save();                                        // Save the updated user to the database
    res.json({ message: 'User updated successfully' });       // Send a success message in JSON format
  } catch (err) {
    res.status(400).json({ error: err.message });             // Send a 400 status and the error message in JSON format if an error occurs
  }
});

// Route to delete a user
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);                // Find the user by ID and delete them
    res.json({ message: 'User deleted successfully' });       // Send a success message in JSON format
  } catch (err) {
    res.status(400).json({ error: err.message });             // Send a 400 status and the error message in JSON format if an error occurs
  }
});

module.exports = router;                                      // Export the router object