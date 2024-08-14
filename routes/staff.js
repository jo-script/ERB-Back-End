const express = require('express');                      // Import the express module
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();                         // Create a new router object
const Staff = require('../models/Staff');                // Import the Product model
// const path = require('path');
// const multer = require('multer');

const uploadImg = require('./upload')

// Get all staff
router.get('/staff', authMiddleware, async (req, res) => {
  try {
    const staff = await Staff.find({ user: req.user._id })
    res.status(200).json(staff);                         // Send a 200 status and the list of all staff in JSON format
  } catch (error) {
    res.status(400).json({ error: error.message });      // Send a 400 status and the error message in JSON format if an error occurs
  }
});
// Get all staff
router.get('/staff/:id', authMiddleware, async (req, res) => {
  try {

    const staff = await Staff.findById(req.params.id).select('-user')
    if (staff) {

      res.status(200).json(staff);                         // Send a 200 status and the list of all staff in JSON format
    } else res.status(404).json('Staff not found')
  } catch (error) {
    res.status(400).json({ error: error.message });      // Send a 400 status and the error message in JSON format if an error occurs
  }
});

router.post('/createStaff', authMiddleware, uploadImg('image'), async (req, res) => {

  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imagePath = `img/${req.file.filename}`;

    const staff = new Staff({ ...req.body, img: imagePath, user: req.user.id }); // Create a new staff instance with the request body
    await staff.save();                                // Save the new staff to the database
    res.status(201).json(staff);                       // Send a 201 status and a success message in JSON format
  } catch (error) {
    res.status(400).json({ error: error.message });    // Send a 400 status and the error message in JSON format if an error occurs
  }
});

// Update an existing staff
router.put('/updateStaff/:id', authMiddleware, uploadImg('image'), async (req, res) => {   // Define a route to update an existing staff
  try {
    const staff = await Staff.findById(req.params.id); // Find the staff by ID
    if (!staff) res.status(404).json('staff not found'); // Send a 404 status and a not found message in JSON format if the staff does not exist
    // if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const updateData = req.file ? { ...req.body, img: `img/${req.file.filename}` } : req.body;

    // const imagePath = `img/${req.file.filename}`;
    const result = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true }); // Update the staff with the request body and return the updated staff
    res.status(201).json('Update successfully');                     // Send a 201 status and the updated staff in JSON format
  } catch (error) {
    res.status(400).json({ error: error.message });    // Send a 400 status and the error message in JSON format if an error occurs
  }
});

// Delete a staff
router.delete('/deleteStaff/:id', authMiddleware, async (req, res) => { // Define a route to delete a staff
  try {
    const staff = await Staff.findById(req.params.id); // Find the staff by ID
    if (!staff) res.status(404).json('staff not found'); // Send a 404 status and a not found message in JSON format if the staff does not exist

    await Staff.findByIdAndDelete(req.params.id);      // Delete the staff by ID
    res.status(201).json('remove staff successfully'); // Send a 201 status and a success message in JSON format
  } catch (error) {
    res.status(400).json({ error: error.message });    // Send a 400 status and the error message in JSON format if an error occurs
  }
});

module.exports = router;                               // Export the router object