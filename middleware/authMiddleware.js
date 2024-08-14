const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {                     // Define an asynchronous middleware function for authentication
  const token = req.header('Authorization').replace('Bearer ', '');    // Extract the token from the Authorization header and remove the 'Bearer ' prefix
  if (!token) {                                                        // Check if the token is not provided
    return res.status(401).json({ error: 'No token, authorization denied' }); // Send a 401 status and an error message in JSON format if the token is not provided
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);         // Verify the token using the secret key and decode it
    req.user = await User.findById(decoded.id).select('-password');    // Find the user by the decoded ID and exclude the password field
    next();                                                            // Call the next middleware function in the stack
  } catch (err) {                                                      // Catch any errors that occur during token verification or user retrieval
    res.status(401).json({ error: 'Token is not valid' });             // Send a 401 status and an error message in JSON format if the token is not valid
  }
};

module.exports = authMiddleware;                                       // Export the authMiddleware function
