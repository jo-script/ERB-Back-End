const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 100,

  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

UserSchema.pre('save', async function (next) { // Before saving a user, execute this function
  if (!this.isModified('password')) next(); // If the password is not modified, skip the rest of the function

  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
  next(); // Proceed to the next middleware or save the user
})

UserSchema.methods.matchPassword = async function (enteredPassword) { // Define a method to compare entered password with the stored password
  return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the hashed password
};

const User = mongoose.model('User', UserSchema);
module.exports = User
