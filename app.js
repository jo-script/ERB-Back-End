const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
app.use('/img', express.static(path.join(__dirname, 'img')));

const connectDB = require('./config/db');                // Import the database connection function
const userController = require('./routes/userController'); // Import the userController routes
const staff = require('./routes/staff');             // Import the product routes
const memo = require('./routes/memo');             // Import the product routes

app.use(cors());                                         // Enable CORS for all routes

connectDB();                                             // Connect to the database

app.use(express.json());
// Parse incoming JSON requests
// ربط الراوتر الخاص برفع الصور
// app.use('/', require('./routes/upload'));



app.use('/', userController);                            // Use userController for all routes starting with '/'
app.use('/', staff);      
app.use('/', memo);      
                             // Use product for all routes starting with '/'
// Use product for all routes starting with '/'

const PORT = process.env.PORT || 4000;                   // Set the port number from environment variable or default to 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and listen on the specified port
