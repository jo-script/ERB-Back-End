const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  city: {
    type: String,
    enum: ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharqia", "South Sinai", "Kafr El Sheikh", "Matruh", "Luxor", "Qena", "North Sinai", "Sohag"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 11,
  },
  salary: {
    type: String,
    required: true,
    minlength: 0,
  },

  workingHours: {
    type: String,
    required: true,
    // minlength: 0,
  },
  job: {
    type: String,
    minlength: 1,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
  },

  img: {
    type: String,
    // required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
  }
}, { timestamps: true })

const Staff = mongoose.model('Staff', StaffSchema)
module.exports = Staff