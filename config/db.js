const mongoose = require("mongoose");

async function connectDB () {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("mongoDB Connect...");
    
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = connectDB 